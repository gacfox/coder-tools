"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

type StatusItem = {
  code: string;
  title: string;
  description: string;
  useCase: string;
};

type StatusGroup = {
  range: string;
  name: string;
  items: StatusItem[];
};

const STATUS_GROUPS: StatusGroup[] = [
  {
    range: "1××",
    name: "信息响应",
    items: [
      {
        code: "100",
        title: "Continue",
        description: "请求已收到，客户端应继续发送请求体。",
        useCase: "很少用于 SEO。",
      },
      {
        code: "101",
        title: "Switching Protocols",
        description: "服务器按请求切换协议。",
        useCase: "对 SEO 无影响。",
      },
      {
        code: "102",
        title: "Processing",
        description: "请求已收到，正在处理中（WebDAV）。",
        useCase: "长任务场景；SEO 无影响。",
      },
    ],
  },
  {
    range: "2××",
    name: "成功",
    items: [
      {
        code: "200",
        title: "OK",
        description: "请求成功，返回正常内容。",
        useCase: "爬虫最需要的标准响应。",
      },
      {
        code: "201",
        title: "Created",
        description: "资源已创建（常见于 POST）。",
        useCase: "API 创建成功；非爬虫页面。",
      },
      {
        code: "202",
        title: "Accepted",
        description: "请求已接受，处理尚未完成。",
        useCase: "异步任务；SEO 无影响。",
      },
      {
        code: "203",
        title: "Non-Authoritative Information",
        description: "响应由代理转换后返回。",
        useCase: "少见；SEO 价值不大。",
      },
      {
        code: "204",
        title: "No Content",
        description: "成功但无响应体。",
        useCase: "常用于 API。",
      },
      {
        code: "205",
        title: "Reset Content",
        description: "客户端应重置表单。",
        useCase: "非 SEO 场景。",
      },
      {
        code: "206",
        title: "Partial Content",
        description: "返回部分内容（Range）。",
        useCase: "媒体/大文件；非 SEO。",
      },
      {
        code: "207",
        title: "Multi-Status",
        description: "WebDAV 多状态响应。",
        useCase: "非 SEO。",
      },
      {
        code: "208",
        title: "Already Reported",
        description: "WebDAV 避免重复报告。",
        useCase: "非 SEO。",
      },
      {
        code: "226",
        title: "IM Used",
        description: "服务器应用了差分编码。",
        useCase: "少见；非 SEO。",
      },
    ],
  },
  {
    range: "3××",
    name: "重定向",
    items: [
      {
        code: "300",
        title: "Multiple Choices",
        description: "资源有多个选项。",
        useCase: "可能让爬虫困惑；尽量避免。",
      },
      {
        code: "301",
        title: "Moved Permanently",
        description: "资源永久重定向。",
        useCase: "SEO 友好重定向。",
      },
      {
        code: "302",
        title: "Found",
        description: "临时重定向。",
        useCase: "不建议长期使用；可考虑 301。",
      },
      {
        code: "303",
        title: "See Other",
        description: "将请求引导为 GET 到新地址。",
        useCase: "常用于表单提交后的跳转。",
      },
      {
        code: "304",
        title: "Not Modified",
        description: "资源未修改，可使用缓存。",
        useCase: "减少爬虫负载。",
      },
      {
        code: "305",
        title: "Use Proxy",
        description: "必须通过代理访问（已废弃）。",
        useCase: "可忽略。",
      },
      {
        code: "307",
        title: "Temporary Redirect",
        description: "临时重定向，保留请求方法。",
        useCase: "临时迁移；不做长期 SEO。",
      },
      {
        code: "308",
        title: "Permanent Redirect",
        description: "永久重定向，保留请求方法。",
        useCase: "可作为 301 替代。",
      },
    ],
  },
  {
    range: "4××",
    name: "客户端错误",
    items: [
      {
        code: "400",
        title: "Bad Request",
        description: "请求语法错误。",
        useCase: "检查日志并修复。",
      },
      {
        code: "401",
        title: "Unauthorized",
        description: "需要认证。",
        useCase: "可能误拦爬虫。",
      },
      {
        code: "402",
        title: "Payment Required",
        description: "保留字段。",
        useCase: "非 SEO。",
      },
      {
        code: "403",
        title: "Forbidden",
        description: "服务器拒绝请求。",
        useCase: "确保重要页面未被限制。",
      },
      {
        code: "404",
        title: "Not Found",
        description: "资源不存在。",
        useCase: "可重定向或自定义页面。",
      },
      {
        code: "405",
        title: "Method Not Allowed",
        description: "请求方法不被允许。",
        useCase: "检查 API 路由。",
      },
      {
        code: "406",
        title: "Not Acceptable",
        description: "无法返回请求的格式。",
        useCase: "少见；非 SEO。",
      },
      {
        code: "407",
        title: "Proxy Authentication Required",
        description: "需要代理认证。",
        useCase: "非 SEO。",
      },
      {
        code: "408",
        title: "Request Timeout",
        description: "服务器等待超时。",
        useCase: "可能影响爬虫抓取。",
      },
      {
        code: "409",
        title: "Conflict",
        description: "请求冲突（编辑冲突等）。",
        useCase: "Web 应用常见；非 SEO。",
      },
      {
        code: "410",
        title: "Gone",
        description: "资源已永久移除。",
        useCase: "告知搜索引擎内容已下线。",
      },
      {
        code: "411",
        title: "Length Required",
        description: "缺少 Content-Length。",
        useCase: "少见；非 SEO。",
      },
      {
        code: "412",
        title: "Precondition Failed",
        description: "前置条件未满足。",
        useCase: "API/WebDAV。",
      },
      {
        code: "413",
        title: "Payload Too Large",
        description: "请求体过大。",
        useCase: "非 SEO。",
      },
      {
        code: "414",
        title: "Request-URI Too Long",
        description: "URL 过长。",
        useCase: "避免超长 URL。",
      },
      {
        code: "415",
        title: "Unsupported Media Type",
        description: "媒体类型不支持。",
        useCase: "非 SEO。",
      },
      {
        code: "416",
        title: "Requested Range Not Satisfiable",
        description: "Range 无效。",
        useCase: "非 SEO。",
      },
      {
        code: "417",
        title: "Expectation Failed",
        description: "无法满足 Expect。",
        useCase: "少见。",
      },
      {
        code: "418",
        title: "I'm a Teapot",
        description: "玩笑状态码。",
        useCase: "无 SEO。",
      },
      {
        code: "421",
        title: "Misdirected Request",
        description: "请求被发送到错误的服务器。",
        useCase: "CDN/代理配置问题。",
      },
      {
        code: "422",
        title: "Unprocessable Entity",
        description: "语义错误（WebDAV）。",
        useCase: "非 SEO。",
      },
      {
        code: "423",
        title: "Locked",
        description: "资源被锁定（WebDAV）。",
        useCase: "非 SEO。",
      },
      {
        code: "424",
        title: "Failed Dependency",
        description: "依赖失败（WebDAV）。",
        useCase: "非 SEO。",
      },
      {
        code: "426",
        title: "Upgrade Required",
        description: "需要升级协议。",
        useCase: "非 SEO。",
      },
      {
        code: "428",
        title: "Precondition Required",
        description: "必须提供前置条件。",
        useCase: "少见。",
      },
      {
        code: "429",
        title: "Too Many Requests",
        description: "请求过多，被限流。",
        useCase: "可能阻挡爬虫。",
      },
      {
        code: "431",
        title: "Request Header Fields Too Large",
        description: "请求头过大。",
        useCase: "可能阻挡爬虫。",
      },
      {
        code: "444",
        title: "Connection Closed Without Response",
        description: "连接被直接关闭（nginx）。",
        useCase: "排查 WAF/CDN 误拦。",
      },
      {
        code: "451",
        title: "Unavailable for Legal Reasons",
        description: "法律原因不可用。",
        useCase: "表示内容因法律原因下线。",
      },
      {
        code: "499",
        title: "Client Closed Request",
        description: "客户端提前断开（nginx）。",
        useCase: "排查 TTFB 与超时。",
      },
    ],
  },
  {
    range: "5××",
    name: "服务器错误",
    items: [
      {
        code: "500",
        title: "Internal Server Error",
        description: "服务器内部错误。",
        useCase: "需尽快修复，影响 SEO。",
      },
      {
        code: "501",
        title: "Not Implemented",
        description: "未实现功能。",
        useCase: "少见。",
      },
      {
        code: "502",
        title: "Bad Gateway",
        description: "上游响应无效。",
        useCase: "检查主机/CDN。",
      },
      {
        code: "503",
        title: "Service Unavailable",
        description: "服务不可用或超载。",
        useCase: "计划停机可使用。",
      },
      {
        code: "504",
        title: "Gateway Timeout",
        description: "上游超时。",
        useCase: "检查主机/CDN。",
      },
      {
        code: "505",
        title: "HTTP Version Not Supported",
        description: "HTTP 版本不支持。",
        useCase: "少见。",
      },
      {
        code: "506",
        title: "Variant Also Negotiates",
        description: "内容协商配置错误。",
        useCase: "少见。",
      },
      {
        code: "507",
        title: "Insufficient Storage",
        description: "存储不足（WebDAV）。",
        useCase: "非 SEO。",
      },
      {
        code: "508",
        title: "Loop Detected",
        description: "检测到循环（WebDAV）。",
        useCase: "非 SEO。",
      },
      {
        code: "510",
        title: "Not Extended",
        description: "需要扩展。",
        useCase: "少见。",
      },
      {
        code: "511",
        title: "Network Authentication Required",
        description: "需要网络认证。",
        useCase: "非 SEO。",
      },
      {
        code: "599",
        title: "Network Connect Timeout Error",
        description: "网络连接超时（HAProxy/部分 CDN）。",
        useCase: "提示上游不稳定，影响抓取可靠性。",
      },
    ],
  },
];

export default function HttpStatusCodeCheatsheet() {
  const [query, setQuery] = useState("");

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return STATUS_GROUPS;
    const keyword = query.trim().toLowerCase();
    return STATUS_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const haystack = `${item.code} ${item.title} ${item.description} ${item.useCase}`.toLowerCase();
        return haystack.includes(keyword);
      }),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">HTTP状态码速查</h2>
        <p className="text-muted-foreground text-lg">
          常见状态码含义与使用场景（中文速查）
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索状态码或关键词..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-black/5 dark:bg-white/5 border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-8">
          {filteredGroups.map((group) => (
            <section key={group.range} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                  {group.range}
                </span>
                <h3 className="text-xl font-semibold">{group.name}</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {group.items.map((item) => (
                  <div
                    key={`${group.range}-${item.code}`}
                    className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {item.code}
                      </span>
                      <span className="font-semibold">{item.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {item.useCase}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
