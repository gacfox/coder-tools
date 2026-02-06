export interface ToolItem {
  id: string;
  name: string;
}

export interface ToolCategory {
  name: string;
  icon: "hash" | "regex" | "qr" | "binary" | "file" | "flask" | "code";
  tools: ToolItem[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    name: "编码转换",
    icon: "hash",
    tools: [
      { id: "base64-converter", name: "BASE64编解码" },
      { id: "image-base64-converter", name: "BASE64图片编解码" },
      { id: "url-encoder-decoder", name: "URL编解码" },
      { id: "base-converter", name: "进制转换" },
      { id: "unicode-escape", name: "Unicode转义" },
      { id: "morse-code-converter", name: "摩斯电码转换器" },
      { id: "roman-numeral-converter", name: "罗马数字转换器" }
    ]
  },
  {
    name: "文本工具",
    icon: "regex",
    tools: [
      { id: "regex-tester", name: "正则表达式测试" },
      { id: "text-diff", name: "文本差异对比" }
    ]
  },
  {
    name: "图形工具",
    icon: "qr",
    tools: [
      { id: "qr-generator", name: "二维码生成器" },
      { id: "qr-scanner", name: "二维码识别" },
      { id: "image-resizer", name: "图片缩放" },
      { id: "image-cropper", name: "图片裁剪" },
      { id: "ascii-art-generator", name: "ASCII Art生成器" }
    ]
  },
  {
    name: "加密工具",
    icon: "hash",
    tools: [
      { id: "hash-calculator", name: "HASH计算" },
      { id: "password-generator", name: "强随机密码生成器" }
    ]
  },
  {
    name: "开发工具",
    icon: "binary",
    tools: [
      { id: "timestamp-converter", name: "Unix时间戳转换" },
      { id: "user-agent-analyzer", name: "User-Agent分析" },
      { id: "uuid-generator", name: "UUIDv4生成器" },
      { id: "sql-formatter", name: "SQL格式化工具" },
      { id: "cron-expression-tester", name: "Cron表达式测试" },
      { id: "curl-to-fetch", name: "cURL转Fetch" },
      { id: "jwt-parser", name: "JWT解析" },
      { id: "json-viewer", name: "JSON预览器" },
      { id: "springboot-config-converter", name: "SpringBoot配置转换器" },
      { id: "jsonpath-tester", name: "JSONPath测试" },
      { id: "xpath-tester", name: "XPath测试" }
    ]
  },
  {
    name: "文档速查",
    icon: "file",
    tools: [
      { id: "git-cheat-sheet", name: "Git命令速查" },
      { id: "http-status-code-cheatsheet", name: "HTTP状态码速查" },
      { id: "vim-cheat-sheet", name: "Vim指令速查表" },
      { id: "ffmpeg-cheat-sheet", name: "FFMPEG指令速查表" },
      { id: "eclipse-cheat-sheet", name: "Eclipse快捷键速查表" },
      { id: "photoshop-cheat-sheet", name: "PhotoShop快捷键速查表" }
    ]
  },
  {
    name: "设计工具",
    icon: "flask",
    tools: [
      { id: "gradient-generator", name: "渐变CSS生成器" },
      { id: "color-scheme-picker", name: "配色方案选择器" },
      { id: "color-value-converter", name: "颜色值转换器" }
    ]
  },
  {
    name: "审查工具",
    icon: "code",
    tools: [
      { id: "random-code-generator", name: "随机代码生成器" }
    ]
  }
];

export const TOOL_IDS = TOOL_CATEGORIES.flatMap((category) =>
  category.tools.map((tool) => tool.id)
);
