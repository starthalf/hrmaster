import { TourProgressBar } from "@/components/tour/TourProgressBar";

/**
 * Layout for the entire guided tour (/tour/*).
 *
 * - Adds the persistent ProgressBar at the top of every step.
 * - The bottom TourNav is rendered by each step page itself, so individual
 *   pages can control its props (disableNext, nextLabel, onBeforeNext, ...).
 *
 * Welcome (/) deliberately lives OUTSIDE this layout — it has its own
 * full-bleed two-card chooser and doesn't show progress yet.
 */
export default function TourLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TourProgressBar />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
