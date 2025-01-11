import React from "react";
import { redirects } from "@/lib/config/redirects";
import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
import { buttonVariants } from "@repo/ui/components/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full gap-4 p-4">
      <div className="flex items-center justify-center gap-2 text-8xl font-bold">
        <span className="text-primary">4</span>
        <span>0</span>
        <span className="text-primary">4</span>
        <span>!</span>
      </div>
      <p className="text-center text-xl text-muted-foreground">
        We couldn&#39;t find what you were looking for
      </p>
      <Link
        href={redirects.dashboard.index}
        className={cn(buttonVariants(), "px-8")}
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
