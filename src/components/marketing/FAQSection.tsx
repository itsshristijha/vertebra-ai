import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Does VERTEBRA-AI diagnose scoliosis, kyphosis or back pain?",
    a: "No. VERTEBRA-AI produces research-prototype risk indicators and postural-deviation screening estimates. It never diagnoses a spinal disorder and does not replace professional medical assessment. If a risk indicator is elevated, the appropriate next step is to consider a professional evaluation.",
  },
  {
    q: "What accuracy does the model achieve?",
    a: "The underlying project report states that final numerical model performance — accuracy, sensitivity, specificity, calibration and latency — has not yet been established. This prototype does not publish or imply an accuracy figure.",
  },
  {
    q: "Does my video leave my device?",
    a: "The design target is local, on-device pose processing so that video imagery does not need to leave your machine. This prototype's Live Monitor and Demo Mode both run entirely in your browser.",
  },
  {
    q: "What happens if I don't have a wearable IMU?",
    a: "The wearable IMU is optional. VERTEBRA-AI is designed to degrade gracefully and continue functioning from webcam data alone if the IMU stream is unavailable.",
  },
  {
    q: "Is this a finished, clinically validated product?",
    a: "No — this is a Health Informatics capstone research prototype from VIT Bhopal University. It documents a proposed methodology and an interactive demonstration, not a completed clinical evaluation.",
  },
];

export function FAQSection() {
  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 text-center">FAQ</p>
        <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Common questions
        </h2>
        <div className="mt-10 rounded-2xl border border-border bg-card px-6">
          <Accordion type="single" collapsible>
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
