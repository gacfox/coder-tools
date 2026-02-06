import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { TOOL_CATEGORIES } from "@/lib/tools";

export default function ToolsHomePage() {
  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">CODER TOOLS</h2>
        <p className="text-muted-foreground text-lg">选择左侧工具开始使用</p>
      </header>

      <div className="glass-card rounded-[2rem] p-12 shadow-2xl min-h-[420px] flex items-center justify-center border-white/40 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="text-center space-y-6 relative z-10">
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20 transform group-hover:scale-110 transition-transform duration-500">
            <FlaskConical className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">CODER TOOLS</h3>
            <p className="text-muted-foreground max-w-xs mx-auto">
              选择左侧工具开始使用，或在下方快速跳转到常用工具。
            </p>
          </div>
          <a
            href="https://github.com/gacfox/coder-tools"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity inline-block"
          >
            了解更多
          </a>
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">工具导航</h3>
          <p className="text-sm text-muted-foreground">
            每个工具都有独立链接，便于分享与搜索引擎收录。
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {TOOL_CATEGORIES.map((category) => (
            <div
              key={category.name}
              className="rounded-2xl border border-black/10 dark:border-white/10 p-4 bg-black/5 dark:bg-white/5"
            >
              <h4 className="font-medium mb-2">{category.name}</h4>
              <div className="flex flex-wrap gap-2">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/${tool.id}`}
                    className="px-3 py-1.5 text-sm rounded-full bg-background/80 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
