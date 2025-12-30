"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  FlaskConical,
  Search,
  Hash,
  Binary,
  Regex,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Base64Converter from "./base64-converter/page";
import ImageBase64Converter from "./image-base64-converter/page";
import UrlEncoderDecoder from "./url-encoder-decoder/page";
import BaseConverter from "./base-converter/page";
import RegexTester from "./regex-tester/page";
import TextDiff from "./text-diff/page";
import QrGenerator from "./qr-generator/page";
import QrScanner from "./qr-scanner/page";
import ImageResizer from "./image-resizer/page";
import GradientGenerator from "./gradient-generator/page";
import HashCalculator from "./hash-calculator/page";
import PasswordGenerator from "./password-generator/page";
import TimestampConverter from "./timestamp-converter/page";
import AsciiArtGenerator from "./ascii-art-generator/page";
import UserAgentAnalyzer from "./user-agent-analyzer/page";
import UUIDGenerator from "./uuid-generator/page";
import SQLFormatter from "./sql-formatter/page";
import UnicodeEscape from "./unicode-escape/page";
import JwtParser from "./jwt-parser/page";

interface Tool {
  id: string;
  name: string;
}

interface Category {
  name: string;
  icon: React.ReactNode;
  tools: Tool[];
}

const CATEGORIES: Category[] = [
  {
    name: "编码转换",
    icon: <Hash className="w-4 h-4" />,
    tools: [
      { id: "base64-converter", name: "BASE64编解码" },
      { id: "image-base64-converter", name: "BASE64图片编解码" },
      { id: "url-encoder-decoder", name: "URL编解码" },
      { id: "base-converter", name: "进制转换" },
      { id: "unicode-escape", name: "Unicode转义" },
    ],
  },
  {
    name: "文本工具",
    icon: <Regex className="w-4 h-4" />,
    tools: [
      { id: "regex-tester", name: "正则表达式测试" },
      { id: "text-diff", name: "文本差异对比" },
    ],
  },
  {
    name: "图形工具",
    icon: <QrCode className="w-4 h-4" />,
    tools: [
      { id: "qr-generator", name: "二维码生成器" },
      { id: "qr-scanner", name: "二维码识别" },
      { id: "image-resizer", name: "图片缩放" },
      { id: "ascii-art-generator", name: "ASCII Art生成器" },
      { id: "gradient-generator", name: "渐变CSS生成器" },
    ],
  },
  {
    name: "加密工具",
    icon: <Hash className="w-4 h-4" />,
    tools: [
      { id: "hash-calculator", name: "HASH计算" },
      { id: "password-generator", name: "强随机密码生成器" },
    ],
  },
  {
    name: "开发工具",
    icon: <Binary className="w-4 h-4" />,
    tools: [
      { id: "timestamp-converter", name: "Unix时间戳转换" },
      { id: "user-agent-analyzer", name: "User-Agent分析" },
      { id: "uuid-generator", name: "UUIDv4生成器" },
      { id: "sql-formatter", name: "SQL格式化工具" },
      { id: "jwt-parser", name: "JWT解析" },
    ],
  },
];

export default function Home() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "编码转换",
  ]);
  const [selectedTool, setSelectedTool] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter tools based on search query
  const filteredCategories = CATEGORIES.map((category) => {
    if (!searchQuery) {
      return category;
    }

    const filteredTools = category.tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
      ...category,
      tools: filteredTools,
    };
  }).filter(
    (category) =>
      // Only show categories that have matching tools or if there's no search query
      !searchQuery || category.tools.length > 0
  );

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  return (
    <div className="flex h-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass border-r h-full flex flex-col">
        <div className="p-4">
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
          {filteredCategories.map((category) => (
            <div key={category.name} className="space-y-1">
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
              >
                <span className="text-muted-foreground transition-transform duration-200">
                  {expandedCategories.includes(category.name) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </span>
                <span className="p-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  {category.icon}
                </span>
                <span className="flex-1 text-left">{category.name}</span>
              </button>

              {expandedCategories.includes(category.name) && (
                <div className="ml-9 space-y-1">
                  {category.tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-sm rounded-lg transition-all",
                        selectedTool === tool.id
                          ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                          : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                      )}
                    >
                      {tool.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8 relative">
        <div className="max-w-4xl mx-auto space-y-8">
          {selectedTool === "base64-converter" ? (
            <Base64Converter />
          ) : selectedTool === "image-base64-converter" ? (
            <ImageBase64Converter />
          ) : selectedTool === "url-encoder-decoder" ? (
            <UrlEncoderDecoder />
          ) : selectedTool === "base-converter" ? (
            <BaseConverter />
          ) : selectedTool === "regex-tester" ? (
            <RegexTester />
          ) : selectedTool === "text-diff" ? (
            <TextDiff />
          ) : selectedTool === "qr-generator" ? (
            <QrGenerator />
          ) : selectedTool === "qr-scanner" ? (
            <QrScanner />
          ) : selectedTool === "image-resizer" ? (
            <ImageResizer />
          ) : selectedTool === "gradient-generator" ? (
            <GradientGenerator />
          ) : selectedTool === "hash-calculator" ? (
            <HashCalculator />
          ) : selectedTool === "password-generator" ? (
            <PasswordGenerator />
          ) : selectedTool === "timestamp-converter" ? (
            <TimestampConverter />
          ) : selectedTool === "ascii-art-generator" ? (
            <AsciiArtGenerator />
          ) : selectedTool === "user-agent-analyzer" ? (
            <UserAgentAnalyzer />
          ) : selectedTool === "uuid-generator" ? (
            <UUIDGenerator />
          ) : selectedTool === "sql-formatter" ? (
            <SQLFormatter />
          ) : selectedTool === "unicode-escape" ? (
            <UnicodeEscape />
          ) : selectedTool === "jwt-parser" ? (
            <JwtParser />
          ) : selectedTool === "" ? (
            <>
              <header className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                  CODER TOOLS
                </h2>
                <p className="text-muted-foreground text-lg">
                  选择左侧工具开始使用
                </p>
              </header>

              <div className="glass-card rounded-[2rem] p-12 shadow-2xl min-h-[500px] flex items-center justify-center border-white/40 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="text-center space-y-6 relative z-10">
                  <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20 transform group-hover:scale-110 transition-transform duration-500">
                    <FlaskConical className="w-12 h-12 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold">CODER TOOLS</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">
                      选择左侧工具开始使用，或点击下方按钮了解更多。
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
            </>
          ) : (
            <div className="p-12 text-center">
              <p className="text-lg text-muted-foreground">工具未找到</p>
            </div>
          )}
        </div>

        {/* Background blobs for Liquid style */}
        <div className="fixed top-1/4 -right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10" />
        <div className="fixed bottom-1/4 -left-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl -z-10" />
      </main>
    </div>
  );
}
