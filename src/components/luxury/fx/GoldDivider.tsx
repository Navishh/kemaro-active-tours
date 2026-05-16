import { cn } from "@/lib/utils";

const GoldDivider = ({ className }: { className?: string }) => (
  <div className={cn("relative h-px w-full overflow-hidden", className)} aria-hidden>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
  </div>
);

export default GoldDivider;
