"use client";

import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type EclipseItem = {
  action: string;
  win: string;
  mac: string;
};

export type EclipseSection = {
  id: string;
  title: string;
  description?: string;
  tone: string;
  items: EclipseItem[];
};

type EclipseSectionProps = {
  section: EclipseSection;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
};

export default function EclipseSection({
  section,
  copiedId,
  onCopy,
}: EclipseSectionProps) {
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

      <div className="space-y-3">
        {section.items.map((item, index) => {
          const itemId = `${section.id}-${index}`;
          const isCopied = copiedId === itemId;
          const comboText = `Windows/Linux: ${item.win}\nmacOS: ${item.mac}`;

          return (
            <div
              key={itemId}
              className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    {item.action}
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/20 p-3">
                      <p className="text-xs text-muted-foreground mb-2">
                        Windows / Linux
                      </p>
                      <p className="font-mono text-foreground">{item.win}</p>
                    </div>
                    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/20 p-3">
                      <p className="text-xs text-muted-foreground mb-2">
                        macOS
                      </p>
                      <p className="font-mono text-foreground">{item.mac}</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onCopy(comboText, itemId)}
                  className={cn(
                    "p-2 rounded-lg transition-all flex-shrink-0",
                    isCopied
                      ? "bg-emerald-500 text-white"
                      : "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                  )}
                  title="复制快捷键"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
