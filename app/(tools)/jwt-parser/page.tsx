"use client";

import { useState } from "react";
import { Copy, Download, Key } from "lucide-react";
import { cn } from "@/lib/utils";

interface JwtPayload {
  [key: string]: any;
}

export default function JwtParser() {
  const [jwtToken, setJwtToken] = useState("");
  const [header, setHeader] = useState<any>(null);
  const [payload, setPayload] = useState<JwtPayload | null>(null);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [decodedHeader, setDecodedHeader] = useState("");
  const [decodedPayload, setDecodedPayload] = useState("");

  const parseJwt = () => {
    if (!jwtToken.trim()) {
      setError("请输入JWT令牌");
      setHeader(null);
      setPayload(null);
      setSignature("");
      return;
    }

    try {
      setError("");
      const parts = jwtToken.split(".");

      if (parts.length !== 3) {
        throw new Error("无效的JWT格式：JWT必须包含三部分（头部.载荷.签名）");
      }

      // Decode header
      const headerPart = parts[0];
      const decodedHeader = atob(
        headerPart.replace(/-/g, "+").replace(/_/g, "/")
      );
      setDecodedHeader(decodedHeader);
      setHeader(JSON.parse(decodedHeader));

      // Decode payload
      const payloadPart = parts[1];
      const decodedPayload = atob(
        payloadPart.replace(/-/g, "+").replace(/_/g, "/")
      );
      setDecodedPayload(decodedPayload);
      setPayload(JSON.parse(decodedPayload));

      // Set signature
      setSignature(parts[2]);
    } catch (err) {
      setError(`JWT解析失败：${(err as Error).message}`);
      setHeader(null);
      setPayload(null);
      setSignature("");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadResult = () => {
    if (!payload) return;

    const content = `JWT解析结果：

头部 (Header):
${JSON.stringify(header, null, 2)}

载荷 (Payload):
${JSON.stringify(payload, null, 2)}

签名 (Signature):
${signature}`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jwt_parsed.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setJwtToken("");
    setHeader(null);
    setPayload(null);
    setSignature("");
    setDecodedHeader("");
    setDecodedPayload("");
    setError("");
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">JWT解析工具</h2>
        <p className="text-muted-foreground text-lg">
          解析JWT令牌中的头部、载荷和签名信息
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                JWT令牌
              </label>
              <textarea
                value={jwtToken}
                onChange={(e) => setJwtToken(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
                className="w-full h-32 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={parseJwt}
                className="px-4 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Key className="w-4 h-4" />
                解析JWT
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                清空
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {payload && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground">
                      头部 (Header)
                    </label>
                    <button
                      onClick={() =>
                        copyToClipboard(JSON.stringify(header, null, 2))
                      }
                      className="text-xs px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    >
                      复制
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-mono text-sm overflow-x-auto">
                    <pre className="whitespace-pre-wrap break-words">
                      {JSON.stringify(header, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground">
                      载荷 (Payload)
                    </label>
                    <button
                      onClick={() =>
                        copyToClipboard(JSON.stringify(payload, null, 2))
                      }
                      className="text-xs px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    >
                      复制
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-mono text-sm overflow-x-auto">
                    <pre className="whitespace-pre-wrap break-words">
                      {JSON.stringify(payload, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground">
                      签名 (Signature)
                    </label>
                    <button
                      onClick={() => copyToClipboard(signature)}
                      className="text-xs px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    >
                      复制
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-mono text-sm break-all">
                    {signature}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-muted-foreground">
                    载荷详情
                  </label>
                  <button
                    onClick={downloadResult}
                    className="text-xs px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    下载
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                  <div className="space-y-3">
                    {payload.iss && (
                      <div>
                        <span className="font-medium text-muted-foreground">
                          签发者 (iss):
                        </span>
                        <span className="ml-2">{payload.iss}</span>
                      </div>
                    )}
                    {payload.sub && (
                      <div>
                        <span className="font-medium text-muted-foreground">
                          主题 (sub):
                        </span>
                        <span className="ml-2">{payload.sub}</span>
                      </div>
                    )}
                    {payload.aud && (
                      <div>
                        <span className="font-medium text-muted-foreground">
                          受众 (aud):
                        </span>
                        <span className="ml-2">
                          {Array.isArray(payload.aud)
                            ? payload.aud.join(", ")
                            : payload.aud}
                        </span>
                      </div>
                    )}
                    {payload.exp && (
                      <div>
                        <span className="font-medium text-muted-foreground">
                          过期时间 (exp):
                        </span>
                        <span className="ml-2">
                          {new Date(payload.exp * 1000).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {payload.nbf && (
                      <div>
                        <span className="font-medium text-muted-foreground">
                          生效时间 (nbf):
                        </span>
                        <span className="ml-2">
                          {new Date(payload.nbf * 1000).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {payload.iat && (
                      <div>
                        <span className="font-medium text-muted-foreground">
                          签发时间 (iat):
                        </span>
                        <span className="ml-2">
                          {new Date(payload.iat * 1000).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {payload.jti && (
                      <div>
                        <span className="font-medium text-muted-foreground">
                          JWT ID (jti):
                        </span>
                        <span className="ml-2">{payload.jti}</span>
                      </div>
                    )}

                    {/* Render any additional custom claims */}
                    {Object.keys(payload).map((key) => {
                      if (
                        ![
                          "iss",
                          "sub",
                          "aud",
                          "exp",
                          "nbf",
                          "iat",
                          "jti",
                        ].includes(key)
                      ) {
                        return (
                          <div key={key}>
                            <span className="font-medium text-muted-foreground">
                              {key}:
                            </span>
                            <span className="ml-2">
                              {typeof payload[key] === "object"
                                ? JSON.stringify(payload[key])
                                : String(payload[key])}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>
              • 在上方输入框中粘贴完整的JWT令牌（包含头部、载荷和签名三部分）
            </li>
            <li>• 点击"解析JWT"按钮进行解析</li>
            <li>• 解析结果将显示在下方，包括头部、载荷和签名信息</li>
            <li>
              • 载荷详情部分会显示标准JWT声明的含义（如过期时间、签发者等）
            </li>
            <li>
              • 可以点击各部分的"复制"按钮复制对应内容，或点击"下载"保存解析结果
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
