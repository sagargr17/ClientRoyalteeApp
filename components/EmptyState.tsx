import { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-line px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ember-50 text-ember-500">
        <Icon size={22} strokeWidth={1.75} />
      </div>
      <p className="font-display text-base font-medium text-ink">{title}</p>
      <p className="max-w-[26ch] text-sm leading-relaxed text-clay">{description}</p>
    </div>
  );
}
