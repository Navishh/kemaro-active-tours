interface StepperProps {
  steps: string[];
  current: number;
}

const Stepper = ({ steps, current }: StepperProps) => {
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-12">
      {steps.map((label, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <li key={label} className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-[11px] tracking-[0.2em] transition-all duration-500 ease-cinematic ${
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-gold"
                  : done
                  ? "border-primary/60 text-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <span
              className={`hidden md:inline text-[11px] uppercase tracking-[0.25em] transition-colors duration-500 ${
                active ? "text-foreground" : done ? "text-primary/80" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <span
                className={`hidden md:inline-block h-px w-10 transition-colors duration-500 ${
                  done ? "bg-primary/60" : "bg-border"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default Stepper;
