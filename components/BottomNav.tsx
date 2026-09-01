"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, CalendarClock, Grid2x2, Receipt, User } from "lucide-react";

const TABS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/slots", label: "Slots", icon: CalendarClock },
  { href: "/items", label: "Items", icon: Grid2x2 },
  { href: "/invoices", label: "History", icon: Receipt },
  { href: "/profile", label: "Card", icon: User },
];



// the above provided code is great , the only one thing i need is change the name from menu items and also create a item detail page where user could see the detailed item page and able to add to favourites . also please update in the card section details about the tenant also ?

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky bottom-0 z-40 border-t border-line bg-paper/90 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="relative flex flex-col items-center gap-1 py-2.5 text-xs"
              >
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute top-1 h-8 w-8 rounded-full bg-ember-50"
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  />
                )}
                <Icon
                  size={20}
                  strokeWidth={active ? 2.25 : 1.75}
                  className={`relative z-10 ${active ? "text-ember-500" : "text-clay"}`}
                />
                <span
                  className={`relative z-10 font-medium ${
                    active ? "text-ember-600" : "text-clay"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
