import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center animate-in fade-in-50",
        className
      )}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
        <Icon className="h-10 w-10 text-primary" strokeWidth={1.5} />
      </div>
      <h3 className="mb-2 text-2xl font-heading font-semibold tracking-tight">
        {title}
      </h3>
      <p className="mb-8 max-w-sm text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      {children && <div>{children}</div>}
    </div>
  );
}
