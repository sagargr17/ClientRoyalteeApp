"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Grid2x2 } from "lucide-react";
import AuthGate from "@/components/AuthGate";
import PageHeader from "@/components/PageHeader";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/lib/auth-context";
import { getTenantItems } from "@/lib/api";
import type { TenantItem } from "@/lib/types";

function ItemsContent() {
  const { token } = useAuth();
  const [items, setItems] = useState<TenantItem[] | null>(null);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    if (!token) return;
    getTenantItems(token)
      .then(setItems)
      .catch(() => setItems([]));
  }, [token]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items?.forEach((i) => i.category && set.add(i.category));
    return ["All", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    if (!items) return [];
    return items.filter((i) => {
      const matchesCategory = activeCategory === "All" || i.category === activeCategory;
      const matchesQuery = i.name.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [items, activeCategory, query]);

  return (
    <div>
      <PageHeader eyebrow="From your tenant" title="Menu" />

      <div className="px-5 pt-3">
        <div className="flex items-center gap-2 rounded-full border border-line bg-cloud px-3.5 py-2.5">
          <Search size={16} className="text-clay" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items"
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-clay focus:outline-none"
          />
        </div>

        {categories.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-ember-500 text-white"
                    : "bg-cloud text-clay"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 space-y-2.5 pb-4">
          {items === null ? (
            <div className="flex justify-center py-14">
              <Spinner />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Grid2x2}
              title="Nothing here yet"
              description="Your tenant hasn't posted items matching this search."
            />
          ) : (
            filtered.map((item) => <ItemCard key={item.id} item={item} />)
          )}
        </div>
      </div>
    </div>
  );
}

export default function ItemsPage() {
  return (
    <AuthGate>
      <ItemsContent />
    </AuthGate>
  );
}
