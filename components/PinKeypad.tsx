"use client";

import { Delete } from "lucide-react";
import { motion } from "framer-motion";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

export default function PinKeypad({
  value,
  onChange,
  length = 4,
  shake = false,
}: {
  value: string;
  onChange: (next: string) => void;
  length?: number;
  shake?: boolean;
}) {
  const press = (key: string) => {
    if (key === "back") {
      onChange(value.slice(0, -1));
      return;
    }
    if (key === "") return;
    if (value.length >= length) return;
    onChange(value + key);
  };

  return (
    <div className="w-full">
      <motion.div
        className="mb-8 flex justify-center gap-3"
        animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {Array.from({ length }).map((_, i) => (
          <div
            key={i}
            className={`flex h-14 w-11 items-center justify-center rounded-stub border-2 font-mono text-xl font-semibold transition-colors ${
              i < value.length
                ? "border-ember-500 bg-ember-50 text-ember-600"
                : "border-line text-clay"
            }`}
          >
            {value[i] ? "•" : ""}
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-3 gap-3 px-4">
        {KEYS.map((key, i) =>
          key === "" ? (
            <div key={`spacer-${i}`} />
          ) : (
            <button
              key={key}
              type="button"
              onClick={() => press(key)}
              aria-label={key === "back" ? "Delete" : `Digit ${key}`}
              className="flex h-14 items-center justify-center rounded-full font-display text-lg font-medium text-ink transition-transform active:scale-90 active:bg-cloud"
            >
              {key === "back" ? <Delete size={20} className="text-clay" /> : key}
            </button>
          )
        )}
      </div>
    </div>
  );
}
