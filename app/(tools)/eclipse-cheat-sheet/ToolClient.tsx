"use client";

import { useMemo, useState } from "react";
import { Search, Compass } from "lucide-react";
import EclipseSection, {
  EclipseSection as EclipseSectionType,
} from "./components/EclipseSection";

const SECTIONS: EclipseSectionType[] = [
  {
    id: "general",
    title: "通用操作",
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    items: [
      {
        action: "快速访问搜索（视图、操作、向导等）",
        win: "Ctrl+3",
        mac: "⌘+3",
      },
      {
        action: "显示所有可用视图并选择打开",
        win: "Alt+Shift+Q, Q",
        mac: "⌥+⇧+Q, Q",
      },
      {
        action: "在当前文件中查找/替换",
        win: "Ctrl+F",
        mac: "⌘+F",
      },
      {
        action: "在当前文件、项目或工作区中查找/替换",
        win: "Ctrl+H",
        mac: "⌘+H",
      },
    ],
  },
  {
    id: "navigate",
    title: "导航与理解代码",
    tone: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    items: [
      {
        action: "显示选中元素的 Javadoc",
        win: "F2",
        mac: "F2",
      },
      {
        action: "跳转到选中符号的声明处",
        win: "F3 或 Ctrl+左键点击",
        mac: "F3 或 ⌘+左键点击",
      },
      {
        action: "在“类型层次结构”视图中显示选中符号",
        win: "F4",
        mac: "F4",
      },
    ],
  },
  {
    id: "search",
    title: "搜索代码",
    tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    items: [
      {
        action: "按文件名搜索资源（如文本文件）",
        win: "Ctrl+Shift+R",
        mac: "⌘+⇧+R",
      },
      {
        action: "搜索类型（类、接口、枚举等）",
        win: "Ctrl+Shift+T",
        mac: "⌘+⇧+T",
      },
      {
        action: "在“调用层次结构”中打开选中的可调用符号",
        win: "Ctrl+Alt+H",
        mac: "⌘+⌥+H",
      },
      {
        action: "搜索工作区中该符号的所有引用",
        win: "Ctrl+Shift+G",
        mac: "⌘+⇧+G",
      },
      {
        action: "跳转到指定行号",
        win: "Ctrl+L",
        mac: "⌘+L",
      },
      {
        action: "跳转到下一个问题/警告/错误",
        win: "Ctrl+.",
        mac: "⌘+.",
      },
      {
        action: "跳转到上一个问题/警告/错误",
        win: "Ctrl+,",
        mac: "⌘+,",
      },
    ],
  },
  {
    id: "select",
    title: "代码选择",
    tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    items: [
      {
        action: "扩展选择到包含的代码块",
        win: "Alt+Shift+↑",
        mac: "⌥+⇧+↑",
      },
      {
        action: "缩小上一次扩展的选择",
        win: "Alt+Shift+↓",
        mac: "⌥+⇧+↓",
      },
      {
        action: "扩展选择到下一条语句",
        win: "Alt+Shift+→",
        mac: "⌥+⇧+→",
      },
      {
        action: "扩展选择到上一条语句",
        win: "Alt+Shift+←",
        mac: "⌥+⇧+←",
      },
    ],
  },
  {
    id: "edit",
    title: "编辑代码",
    tone: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    items: [
      {
        action: "删除光标所在行",
        win: "Ctrl+D",
        mac: "⌘+D",
      },
      {
        action: "将当前行向上/下移动一行",
        win: "Alt+↑ / Alt+↓",
        mac: "⌥+↑ / ⌥+↓",
      },
      {
        action: "编辑器缩放（放大/缩小）",
        win: "Ctrl++ / Ctrl+-",
        mac: "⌘++ / ⌘+-",
      },
      {
        action: "打开上下文相关的代码补全",
        win: "Ctrl+Space",
        mac: "⌘+Space",
      },
      {
        action: "切换块（列）选择模式",
        win: "Alt+Shift+A",
        mac: "⌥+⇧+A",
      },
      {
        action: "重命名（变量、字段、方法、类等）",
        win: "Alt+Shift+R",
        mac: "⌥+⇧+R",
      },
      {
        action: "显示当前选择的高级编辑操作",
        win: "Alt+Shift+S",
        mac: "⌥+⇧+S",
      },
      {
        action: "显示当前选择可用的重构操作",
        win: "Alt+Shift+T",
        mac: "⌥+⇧+T",
      },
      {
        action: "显示问题的快速修复建议",
        win: "Ctrl+1",
        mac: "⌘+1",
      },
      {
        action: "切换单行注释",
        win: "Ctrl+/",
        mac: "⌘+/",
      },
      {
        action: "添加块注释",
        win: "Ctrl+Shift+/",
        mac: "⌘+⇧+/",
      },
      {
        action: "移除块注释",
        win: "Ctrl+Shift+\\",
        mac: "⌘+⇧+\\",
      },
    ],
  },
  {
    id: "run-debug",
    title: "构建、运行与调试",
    tone: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    items: [
      {
        action: "构建所有工作区项目",
        win: "Ctrl+B",
        mac: "⌘+B",
      },
      {
        action: "运行上次启动的应用程序",
        win: "Ctrl+F11",
        mac: "⌘+F11",
      },
      {
        action: "调试上次启动的应用程序",
        win: "F11",
        mac: "⌘+F11",
      },
      {
        action: "单步进入（Step into）",
        win: "F5",
        mac: "F5",
      },
      {
        action: "单步跳过（Step over）",
        win: "F6",
        mac: "F6",
      },
      {
        action: "单步返回（Step return）",
        win: "F7",
        mac: "F7",
      },
      {
        action: "继续执行至下一断点（Resume）",
        win: "F8",
        mac: "F8",
      },
      {
        action: "查看选中表达式的值（Inspect）",
        win: "Ctrl+Alt+I",
        mac: "⌘+⌥+I",
      },
    ],
  },
];

export default function EclipseCheatSheet() {
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSections = useMemo(() => {
    if (!query.trim()) return SECTIONS;
    const keyword = query.trim().toLowerCase();
    return SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const haystack = `${item.action} ${item.win} ${item.mac}`.toLowerCase();
        return haystack.includes(keyword);
      }),
    })).filter((section) => section.items.length > 0);
  }, [query]);

  const totalCount = useMemo(
    () => SECTIONS.reduce((sum, section) => sum + section.items.length, 0),
    []
  );

  const matchedCount = useMemo(
    () =>
      filteredSections.reduce((sum, section) => sum + section.items.length, 0),
    [filteredSections]
  );

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const jumpToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Eclipse快捷键速查表
        </h2>
        <p className="text-muted-foreground text-lg">
          通用操作、导航、搜索、编辑与调试快捷键一站式速查
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40 space-y-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索功能、快捷键..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-black/5 dark:bg-white/5 border-none focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-3 items-center text-sm text-muted-foreground">
            <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5">
              共 {totalCount} 条快捷键
            </span>
            {query && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                命中 {matchedCount} 条
              </span>
            )}
          </div>
        </div>

        {!query && (
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => jumpToSection(section.id)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center gap-2"
              >
                <Compass className="w-3.5 h-3.5 text-muted-foreground" />
                {section.title}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-10">
          {filteredSections.map((section) => (
            <EclipseSection
              key={section.id}
              section={section}
              copiedId={copiedId}
              onCopy={handleCopy}
            />
          ))}
        </div>

        {filteredSections.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>未找到匹配的快捷键</p>
          </div>
        )}
      </div>
    </>
  );
}
