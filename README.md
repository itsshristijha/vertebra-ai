# VERTEBRA-AI — Intelligent Posture & Spine Health Prediction
##Live Vercel app: https://vertebra-ai-2.vercel.app
A Next.js implementation of **VERTEBRA-AI**, a VIT Bhopal University Health Informatics capstone
project ("An Intelligent Posture and Spine Disorder Prediction System"). This app is a
**research and wellness prototype** — it does not diagnose spinal disorders or replace
professional medical assessment, and it does not claim any validated accuracy figures (the
underlying project report explicitly states that final numerical model performance has not yet
been established).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app works fully in **Demo Mode** with no
webcam, wearable or backend required — use the LIVE AI / DEMO MODE switch in the top bar (or on
the Live Monitor page) to attempt a real webcam + MediaPipe BlazePose session in a supporting
browser.

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

## What's implemented

- **All 17 requested routes** plus two supporting ones (`/imu`, `/risk/explainability`):
  `/`, `/login`, `/signup`, `/forgot-password`, `/onboarding`, `/dashboard`, `/assessment`,
  `/live-monitor`, `/calibration`, `/spine-health`, `/risk`, `/risk/explainability`, `/trends`,
  `/insights`, `/exercises`, `/reports`, `/privacy`, `/settings`, `/about`, `/imu`.
- **Demo Mode**: a deterministic, seeded demo dataset (`src/lib/demo/data.ts`) drives every
  screen so the product is fully explorable without any sensors or backend. Every simulated value
  is labelled "Demo Data" in the UI.
- **Live Monitor**: a real webcam + [@mediapipe/tasks-vision](https://www.npmjs.com/package/@mediapipe/tasks-vision)
  BlazePose pipeline behind a clean `PoseProvider` abstraction (`src/lib/mediapipe/`), with
  graceful fallback UI for camera-permission-denied, camera-unavailable, model-unavailable,
  no-person-detected and partial-occlusion states.
- **Posture calculations** (`src/lib/posture/calculations.ts`): isolated, pure, unit-testable
  functions for craniovertebral angle, shoulder symmetry, spine tilt, pelvic tilt, postural load,
  deviation duration, Spine Health Score and trend direction — written so they can later be
  validated against the team's actual Python research implementation.
- **Mock API layer** (`src/app/api/**/route.ts`): a full set of Next.js Route Handlers matching
  the project's proposed API architecture (auth, calibration, posture frame/session, IMU,
  dashboard, health-score, risk, trends, weekly report, explanations) — structured so a real
  Python/FastAPI backend can be swapped in behind `src/services/*.ts` without touching UI code.
- **Safety-first copy**: every risk/score/assessment surface renders the mandatory disclaimer
  ("VERTEBRA-AI is a research and wellness prototype. It does not diagnose spinal disorders or
  replace professional medical assessment.") and uses "risk indicator" / "research-prototype
  estimate" language rather than diagnostic claims.
- **Design system**: navy/indigo/teal palette, shadcn-style component primitives built directly on
  Radix UI + Tailwind v4 (see `src/components/ui/`), Framer Motion micro-interactions (globally
  respecting `prefers-reduced-motion` via `MotionConfig`), Recharts for data visualisation.
- **Accessibility**: semantic landmarks, `aria-label`s on icon-only controls, visible focus rings,
  keyboard-operable nav/menus/dialogs (Radix primitives), reduced-motion support.
- **Error/empty states**: camera permission denied, camera unavailable, no person detected,
  partial occlusion, model unavailable, IMU disconnected, network error (calibration save), and
  "no historical data" (Trends/Reports — reachable by deleting stored data on the Privacy page).

## Project structure

```
src/
  app/                     Next.js App Router routes
    (marketing)/           Landing page, /about
    (auth)/                /login, /signup, /forgot-password
    (app)/                 Sidebar + topbar app shell: dashboard, live-monitor, ...
    api/                   Mock backend route handlers
  components/
    ui/                    Hand-rolled shadcn-style primitives (Radix + Tailwind)
    dashboard/ posture/ charts/ calibration/ risk/ exercises/ reports/ privacy/
    marketing/ layout/ auth/ onboarding/ settings/ trends/
  lib/
    posture/calculations.ts   Isolated posture-feature math
    mediapipe/                PoseProvider abstraction (Demo + real BlazePose)
    demo/data.ts               Deterministic demo dataset
    store/appStore.ts          Zustand global UI state (mode, sensors, settings)
  services/                Fetch wrappers around the mock API
  types/                   Shared TypeScript domain types
```

## Connecting a real backend

Replace the fetch calls in `src/services/*.ts` with calls to your FastAPI backend (update `BASE`
to the backend origin and add auth headers as needed). The Next.js route handlers in
`src/app/api/**` document the expected request/response shape for each endpoint and can be
deleted once the real backend is live. `src/lib/posture/calculations.ts` and the `PoseProvider`
interface in `src/lib/mediapipe/types.ts` are the two integration points for a validated ML
pipeline.

## Medical safety

This prototype must not be described as diagnostic. See `src/components/posture/RiskDisclaimer.tsx`
for the disclaimer component rendered across risk/score/assessment views, and `src/types/risk.ts`
for the safety notes on wording.
