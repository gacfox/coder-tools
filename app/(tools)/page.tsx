import Link from "next/link";
import {
  Binary,
  Code as CodeIcon,
  FileJson,
  FlaskConical,
  Hash,
  QrCode,
  Regex
} from "lucide-react";
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

export default function ToolsHomePage() {
  const totalTools = TOOL_CATEGORIES.reduce(
    (count, category) => count + category.tools.length,
    0
  );

  return (
    <>
      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/70 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          开发者工具导航
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-semibold tracking-tight">
            CODER TOOLS
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            为开发与设计准备的高效工具集合，每个工具都有独立链接，便于分享与搜索引擎收录。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="#tool-nav"
            className="px-5 py-2.5 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            浏览全部工具
          </Link>
          <a
            href="https://github.com/gacfox/coder-tools"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full border border-black/10 dark:border-white/20 text-foreground font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            GitHub 项目
          </a>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
            <p className="text-xs text-muted-foreground">工具数量</p>
            <p className="text-2xl font-semibold">{totalTools}</p>
          </div>
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
            <p className="text-xs text-muted-foreground">分类数量</p>
            <p className="text-2xl font-semibold">{TOOL_CATEGORIES.length}</p>
          </div>
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
            <p className="text-xs text-muted-foreground">快速入口</p>
            <p className="text-sm text-muted-foreground mt-1">
              左侧导航支持搜索与分类筛选
            </p>
          </div>
        </div>
      </header>

      <section className="space-y-5" id="tool-nav">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold">工具导航</h3>
            <p className="text-sm text-muted-foreground">
              选择分类后直达对应工具页面。
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            共 {totalTools} 个工具
          </span>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {TOOL_CATEGORIES.map((category) => {
            const Icon = ICONS[category.icon];
            return (
              <div
                key={category.name}
                className="rounded-3xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-white/70 to-white/30 dark:from-white/5 dark:to-white/0 p-6 shadow-[0_25px_50px_-40px_rgba(15,23,42,0.6)]"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">{category.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {category.tools.length} 个工具
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.tools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/${tool.id}`}
                      className="px-3 py-1.5 text-sm rounded-full border border-black/10 dark:border-white/15 bg-white/80 dark:bg-white/5 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
