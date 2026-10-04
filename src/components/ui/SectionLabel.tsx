import { cn } from "@/lib/cn";

export function SectionLabel({
  index,
  children,
  className,
  tone = "dark",
}: {
  index: string;
  children: React.ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <p className={cn("eyebrow flex items-center gap-4", tone === "dark" ? "text-cinnamon" : "text-gold", className)}>
      <span className="font-display text-[0.8rem] tracking-normal normal-case italic">{index}</span>
      <span aria-hidden className="h-px w-10 bg-current opacity-60" />
      <span>{children}</span>
    </p>
  );
}
