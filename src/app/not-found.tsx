import Link from "next/link";
import { Activity, Home, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-teal-500 text-white">
        <Activity className="h-7 w-7" />
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-indigo-600">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">This page took a wrong turn.</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4" /> Back to home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="h-4 w-4" /> Go to dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
