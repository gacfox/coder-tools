"use client";

import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type FfmpegItem = {
  command: string;
  description: string;
};

export type FfmpegSection = {
  id: string;
  title: string;
  description?: string;
  tone: string;
  items: FfmpegItem[];
};

type FfmpegSectionProps = {
  section: FfmpegSection;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
};

export default function FfmpegSection({
  section,
  copiedId,
  onCopy,
}: FfmpegSectionProps) {
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

          return (
            <div
              key={itemId}
              className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <pre className="bg-black/10 dark:bg-white/10 rounded-lg px-3 py-2 overflow-x-auto">
                      <code className="text-sm font-mono text-foreground">
                        {item.command}
                      </code>
                    </pre>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onCopy(item.command, itemId)}
                  className={cn(
                    "p-2 rounded-lg transition-all flex-shrink-0",
                    isCopied
                      ? "bg-emerald-500 text-white"
                      : "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                  )}
                  title="复制命令"
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
