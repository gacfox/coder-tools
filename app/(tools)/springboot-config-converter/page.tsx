"use client";

import { useMemo, useState } from "react";
import { Copy, RotateCcw, Download } from "lucide-react";
import { cn } from "@/lib/utils";

type Scalar = string | number | boolean | null;
type NodeValue = Scalar | NodeValue[] | { [key: string]: NodeValue };

const isPlainObject = (value: NodeValue): value is { [key: string]: NodeValue } =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseScalar = (value: string): Scalar => {
  const trimmed = value.trim();
  if (trimmed === "" || trimmed === '""' || trimmed === "''") return "";
  if (/^(true|false)$/i.test(trimmed)) return trimmed.toLowerCase() === "true";
  if (/^(null|~)$/i.test(trimmed)) return null;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed;
};

const escapePropertiesValue = (value: Scalar) => {
  if (value === null) return "";
  const text = String(value);
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/\f/g, "\\f")
    .replace(/=/g, "\\=")
    .replace(/:/g, "\\:");
};

const unescapePropertiesValue = (value: string) => {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\f/g, "\f")
    .replace(/\\:/g, ":")
    .replace(/\\=/g, "=")
    .replace(/\\\\/g, "\\");
};

const stripInlineComment = (line: string) => {
  let escaped = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if ((char === "#" || char === ";") && (i === 0 || /\s/.test(line[i - 1]))) {
      return line.slice(0, i).trimEnd();
    }
  }
  return line.trimEnd();
};

const setPathValue = (root: { [key: string]: NodeValue }, path: string, value: NodeValue) => {
  const parts = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
  let current: NodeValue = root;

  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i];
    const nextPart = parts[i + 1];
    const isIndex = /^\d+$/.test(part);
    const nextIsIndex = nextPart ? /^\d+$/.test(nextPart) : false;

    if (i === parts.length - 1) {
      if (Array.isArray(current)) {
        current[Number(part)] = value;
      } else if (isPlainObject(current)) {
        current[part] = value;
      }
      return;
    }

    if (Array.isArray(current)) {
      const idx = Number(part);
      if (current[idx] == null) {
        current[idx] = nextIsIndex ? [] : {};
      }
      current = current[idx] as NodeValue;
      continue;
    }

    if (isPlainObject(current)) {
      if (current[part] == null) {
        current[part] = nextIsIndex ? [] : {};
      }
      current = current[part] as NodeValue;
    }
  }
};

const parseProperties = (input: string) => {
  const root: { [key: string]: NodeValue } = {};
  const lines = input.split(/\r?\n/);

  lines.forEach((rawLine) => {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("!")) return;
    const line = stripInlineComment(rawLine);
    if (!line) return;

    let separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) return;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (!key) return;

    setPathValue(root, key, parseScalar(unescapePropertiesValue(value)));
  });

  return root;
};

type StackEntry =
  | { indent: number; type: "object"; value: { [key: string]: NodeValue } }
  | { indent: number; type: "array"; value: NodeValue[] };

const parseYaml = (input: string) => {
  const root: { [key: string]: NodeValue } = {};
  const stack: StackEntry[] = [{ indent: -1, value: root, type: "object" }];
  let pending: { container: { [key: string]: NodeValue }; key: string; indent: number } | null =
    null;

  const lines = input.split(/\r?\n/);
  for (const rawLine of lines) {
    if (!rawLine.trim() || rawLine.trim().startsWith("#")) continue;
    const indent = rawLine.match(/^ */)?.[0].length ?? 0;
    const content = rawLine.trim();

    if (pending && indent > pending.indent) {
      if (content.startsWith("- ")) {
        const nextArray: NodeValue[] = [];
        pending.container[pending.key] = nextArray;
        stack.push({ indent: pending.indent, value: nextArray, type: "array" });
      } else {
        const nextObject: { [key: string]: NodeValue } = {};
        pending.container[pending.key] = nextObject;
        stack.push({ indent: pending.indent, value: nextObject, type: "object" });
      }
      pending = null;
    } else if (pending && indent <= pending.indent) {
      pending.container[pending.key] = "";
      pending = null;
    }

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    const current = stack[stack.length - 1];

    if (content.startsWith("- ")) {
      if (current.type !== "array") {
        continue;
      }
      const itemContent = content.slice(2).trim();
      if (!itemContent) {
        current.value.push("");
        continue;
      }
      const colonIndex = itemContent.indexOf(":");
      if (colonIndex > -1) {
        const key = itemContent.slice(0, colonIndex).trim();
        const value = itemContent.slice(colonIndex + 1).trim();
        const obj: { [key: string]: NodeValue } = {};
        if (value) {
          obj[key] = parseScalar(value);
        } else {
          obj[key] = "";
          pending = { container: obj, key, indent };
        }
        current.value.push(obj);
      } else {
        current.value.push(parseScalar(itemContent));
      }
      continue;
    }

    const colonIndex = content.indexOf(":");
    if (colonIndex === -1) continue;
    const key = content.slice(0, colonIndex).trim();
    const value = content.slice(colonIndex + 1).trim();

    if (current.type !== "object") continue;
    if (value) {
      current.value[key] = parseScalar(value);
    } else {
      pending = { container: current.value, key, indent };
    }
  }

  if (pending) {
    pending.container[pending.key] = "";
  }

  return root;
};

const toProperties = (value: NodeValue) => {
  const lines: string[] = [];

  const walk = (node: NodeValue, prefix: string) => {
    if (Array.isArray(node)) {
      node.forEach((item, index) => {
        const nextPrefix = prefix ? `${prefix}[${index}]` : `[${index}]`;
        walk(item, nextPrefix);
      });
      return;
    }

    if (isPlainObject(node)) {
      Object.entries(node).forEach(([key, child]) => {
        const nextPrefix = prefix ? `${prefix}.${key}` : key;
        walk(child, nextPrefix);
      });
      return;
    }

    lines.push(`${prefix}=${escapePropertiesValue(node)}`);
  };

  walk(value, "");
  return lines.join("\n");
};

const needsQuotes = (value: string) => {
  return (
    value === "" ||
    /[:#\n\r]/.test(value) ||
    /^\s|\s$/.test(value) ||
    /["']/.test(value)
  );
};

const toYaml = (value: NodeValue, indent = 0): string => {
  const pad = " ".repeat(indent);
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (isPlainObject(item) || Array.isArray(item)) {
          return `${pad}-\n${toYaml(item, indent + 2)}`;
        }
        const text = item === null ? "null" : String(item);
        const formatted = needsQuotes(text) ? JSON.stringify(text) : text;
        return `${pad}- ${formatted}`;
      })
      .join("\n");
  }

  if (isPlainObject(value)) {
    return Object.entries(value)
      .map(([key, child]) => {
        if (isPlainObject(child) || Array.isArray(child)) {
          return `${pad}${key}:\n${toYaml(child, indent + 2)}`;
        }
        const text = child === null ? "null" : String(child);
        const formatted = needsQuotes(text) ? JSON.stringify(text) : text;
        return `${pad}${key}: ${formatted}`;
      })
      .join("\n");
  }

  const text = value === null ? "null" : String(value);
  const formatted = needsQuotes(text) ? JSON.stringify(text) : text;
  return `${pad}${formatted}`;
};

export default function SpringBootConfigConverter() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"properties" | "yaml">("properties");

  const handleConvert = () => {
    try {
      if (!inputText.trim()) {
        setOutputText("");
        setError("");
        return;
      }

      if (activeTab === "properties") {
        const obj = parseProperties(inputText);
        setOutputText(toYaml(obj));
      } else {
        const obj = parseYaml(inputText);
        setOutputText(toProperties(obj));
      }
      setError("");
    } catch (err) {
      setError("转换失败：请检查输入格式");
      setOutputText("");
    }
  };

  const handleSwap = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setError("");
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setError("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadOutput = () => {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `springboot-config.${activeTab === "properties" ? "yaml" : "properties"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const outputLabel = useMemo(
    () => (activeTab === "properties" ? "输出 YAML" : "输出 Properties"),
    [activeTab]
  );

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">SpringBoot配置转换器</h2>
        <p className="text-muted-foreground text-lg">
          Properties 与 YAML 互转（注释可忽略，尽最大能力兼容）
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("properties")}
            className={cn(
              "px-4 py-2 rounded-xl font-medium transition-all",
              activeTab === "properties"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            Properties 转 YAML
          </button>
          <button
            onClick={() => setActiveTab("yaml")}
            className={cn(
              "px-4 py-2 rounded-xl font-medium transition-all",
              activeTab === "yaml"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            YAML 转 Properties
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                {activeTab === "properties" ? "输入 Properties" : "输入 YAML"}
              </label>
              <button
                onClick={() => copyToClipboard(inputText)}
                className="text-xs px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <Copy className="w-3 h-3 inline mr-1" />
                复制
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeTab === "properties"
                  ? "例如：server.port=8080"
                  : "例如：server:\n  port: 8080"
              }
              className="w-full h-48 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                {outputLabel}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(outputText)}
                  disabled={!outputText}
                  className={cn(
                    "text-xs px-2 py-1 rounded-lg transition-colors",
                    outputText
                      ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Copy className="w-3 h-3 inline mr-1" />
                  复制
                </button>
                <button
                  onClick={downloadOutput}
                  disabled={!outputText}
                  className={cn(
                    "text-xs px-2 py-1 rounded-lg transition-colors",
                    outputText
                      ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Download className="w-3 h-3 inline mr-1" />
                  下载
                </button>
              </div>
            </div>
            <textarea
              value={outputText}
              readOnly
              placeholder="转换结果会显示在这里..."
              className="w-full h-48 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={handleConvert}
            className="px-6 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20"
          >
            转换
          </button>
          <button
            onClick={handleSwap}
            disabled={!outputText}
            className={cn(
              "px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2",
              outputText
                ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                : "opacity-50 cursor-not-allowed"
            )}
          >
            <RotateCcw className="w-4 h-4" />
            交换内容
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            清空
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 注释与空行会被忽略</li>
            <li>• Properties 支持点号与数组下标（例如：spring.profiles[0]=dev）</li>
            <li>• YAML 支持常见缩进与数组（例如：profiles: [dev, prod]）</li>
          </ul>
        </div>
      </div>
    </>
  );
}
