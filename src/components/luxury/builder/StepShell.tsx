import { ReactNode } from "react";

interface StepShellProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children: ReactNode;
}

const StepShell = ({ eyebrow, title, description, children }: StepShellProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <span className="eyebrow mb-5 block">{eyebrow}</span>
      <h2 className="text-3xl md:text-5xl leading-[1.05] text-foreground mb-5">{title}</h2>
      {description && (
        <p className="text-base md:text-lg leading-loose text-muted-foreground mb-10 max-w-2xl">
          {description}
        </p>
      )}
      <div className="mt-2">{children}</div>
    </div>
  );
};

export default StepShell;
