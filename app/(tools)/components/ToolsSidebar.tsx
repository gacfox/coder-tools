"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  FlaskConical,
  Search,
  Hash,
  Binary,
  Regex,
  QrCode,
  FileJson,
  Code as CodeIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TOOL_CATEGORIES } from "@/lib/tools";

const ICONS = {
  hash: Hash,
  regex: Regex,
  qr: QrCode,
  binary: Binary,
  file: FileJson,
  flask: FlaskConical,
  code: CodeIcon
} as const;

export default function ToolsSidebar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([TOOL_CATEGORIES[0]?.name ?? ""]);

  const activeToolId = useMemo(() => {
    if (pathname === "/") {
      return "";
    }
    const parts = pathname.split("/").filter(Boolean);
    return parts[0] ?? "";
  }, [pathname]);

  useEffect(() => {
    const activeCategory = TOOL_CATEGORIES.find((category) =>
      category.tools.some((tool) => tool.id === activeToolId)
    );
    if (activeCategory && !expandedCategories.includes(activeCategory.name)) {
      setExpandedCategories((prev) => [...prev, activeCategory.name]);
    }
  }, [activeToolId, expandedCategories]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) {
      return TOOL_CATEGORIES;
    }

    return TOOL_CATEGORIES.map((category) => {
      const filteredTools = category.tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.id.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return {
        ...category,
        tools: filteredTools
      };
    }).filter((category) => category.tools.length > 0);
  }, [searchQuery]);

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  return (
    <aside className="w-64 glass border-r h-full flex flex-col">
      <div className="p-4 space-y-3">
        <Link
          href="/"
          className={cn(
            "block px-3 py-2 text-sm font-medium rounded-xl transition-colors",
            pathname === "/"
              ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
              : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
          )}
        >
          工具首页
        </Link>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索工具..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-black/5 dark:bg-white/5 border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {filteredCategories.map((category) => {
          const isExpanded = searchQuery ? true : expandedCategories.includes(category.name);
          const Icon = ICONS[category.icon];
          return (
            <div key={category.name} className="space-y-1">
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
              >
                <span className="text-muted-foreground transition-transform duration-200">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </span>
                <span className="p-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="flex-1 text-left">{category.name}</span>
              </button>

              {isExpanded && (
                <div className="ml-9 space-y-1">
                  {category.tools.map((tool) => {
                    const isActive = tool.id === activeToolId;
                    return (
                      <Link
                        key={tool.id}
                        href={`/${tool.id}`}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "block px-3 py-1.5 text-sm rounded-lg transition-all",
                          isActive
                            ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                            : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                      >
                        {tool.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
