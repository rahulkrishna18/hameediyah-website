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
    <p className={cn("eyebrow flex items-center gap-3", tone === "dark" ? "text-cinnamon" : "text-gold", className)}>
      <span className="font-display text-[0.8rem] tracking-normal normal-case italic">{index}</span>
      <span>{children}</span>
    </p>
  );
}
