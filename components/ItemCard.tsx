import { formatMoney } from "@/lib/format";
import type { TenantItem } from "@/lib/types";

export default function ItemCard({ item }: { item: TenantItem }) {
  const unavailable = item.available === false;

  return (
    <div
      className={`flex gap-3 rounded-card border border-line p-3 ${
        unavailable ? "opacity-50" : ""
      }`}
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-stub bg-cloud">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-lg text-ember-300">
            {item.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-tight text-ink">{item.name}</p>
          {item.price !== undefined && (
            <span className="shrink-0 font-mono text-sm font-medium text-ember-600">
              {formatMoney(item.price, item.currency)}
            </span>
          )}
        </div>
        {item.description && (
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-clay">
            {item.description}
          </p>
        )}
        {unavailable && (
          <span className="mt-1 w-fit rounded-full bg-cloud px-2 py-0.5 text-[11px] font-medium text-clay">
            Unavailable
          </span>
        )}
      </div>
    </div>
  );
}
