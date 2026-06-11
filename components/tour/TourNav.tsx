"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TourStep, getNextStep, getPrevStep } from "@/lib/tour-config";

type Props = {
  current: TourStep;
  /** Disable Next button (e.g. when required fields not filled). */
  disableNext?: boolean;
  /** Override default next-button label. */
  nextLabel?: string;
  /** Run before navigating next (e.g. save form data). Return false to cancel. */
  onBeforeNext?: () => Promise<boolean> | boolean;
  /** Hide the Prev button entirely (rare — only when current step is logically the first). */
  hidePrev?: boolean;
};

export function TourNav({
  current,
  disableNext = false,
  nextLabel,
  onBeforeNext,
  hidePrev = false,
}: Props) {
  const router = useRouter();
  const next = getNextStep(current);
  const prev = getPrevStep(current);

  const handleNext = async () => {
    if (disableNext || !next) return;
    if (onBeforeNext) {
      const ok = await onBeforeNext();
      if (ok === false) return;
    }
    router.push(next.path);
  };

  const handlePrev = () => {
    if (!prev) return;
    router.push(prev.path);
  };

  return (
    <div className="sticky bottom-0 z-30 bg-white/90 backdrop-blur-md border-t border-primary-100">
      <div className="container-x h-20 flex items-center justify-between gap-3">
        {!hidePrev && prev ? (
          <button
            type="button"
            onClick={handlePrev}
            className="btn-secondary"
            aria-label={`이전: ${prev.label}`}
          >
            <ArrowLeft size={16} className="mr-2" />
            이전
          </button>
        ) : (
          <span />
        )}

        {next ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={disableNext}
            className="btn-primary btn-lg"
            aria-label={`다음: ${next.label}`}
          >
            {nextLabel ?? `다음: ${next.label}`}
            <ArrowRight size={16} className="ml-2" />
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
