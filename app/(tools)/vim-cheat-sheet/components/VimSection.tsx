"use client";

import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type VimItem = {
  keys: string;
  description: string;
};

export type VimSection = {
  id: string;
  title: string;
  description?: string;
  tone: string;
  items: VimItem[];
};

type VimSectionProps = {
  section: VimSection;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
};

export default function VimSection({
  section,
  copiedId,
  onCopy,
}: VimSectionProps) {
  return (
    <section id={section.id} className="space-y-4 scroll-mt-28">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={cn(
            "px-3 py-1 rounded-full text-sm font-semibold border",
            section.tone
          )}
        >
          {section.title}
        </span>
        {section.description && (
          <span className="text-sm text-muted-foreground">
            {section.description}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {section.items.map((item, index) => {
          const itemId = `${section.id}-${index}`;
          const isCopied = copiedId === itemId;

          return (
            <div
              key={itemId}
              className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex gap-3 items-start"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => onCopy(item.keys, itemId)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg font-mono text-sm border transition-all",
                      isCopied
                        ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                        : "bg-black/10 dark:bg-white/10 border-black/10 dark:border-white/10 hover:bg-black/20 dark:hover:bg-white/20"
                    )}
                    title="点击复制"
                  >
                    {item.keys}
                  </button>
                  <span className="text-sm text-muted-foreground truncate">
                    {item.description}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onCopy(item.keys, itemId)}
                className={cn(
                  "p-2 rounded-lg transition-all flex-shrink-0",
                  isCopied
                    ? "bg-emerald-500 text-white"
                    : "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                )}
                title="复制指令"
              >
                {isCopied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
