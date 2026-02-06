'use client';

import { useState } from 'react';
import { ArrowRightLeft, Copy, Check, RotateCcw, AlertCircle, FileCode } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParsedCurl {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string | null;
}

export default function CurlToFetch() {
  const [curlInput, setCurlInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'fetch' | 'axios'>('fetch');

  const parseCurlCommand = (command: string): ParsedCurl => {
    const result: ParsedCurl = {
      method: 'GET',
      url: '',
      headers: {},
      body: null,
    };

    let tempCommand = command.trim();

    tempCommand = tempCommand.replace(/^curl\s+/, '');

    const urlMatch = tempCommand.match(/(?:'([^']+)'|"([^"]+)"|(\S+))(?:\s|$)/);
    if (urlMatch) {
      result.url = urlMatch[1] || urlMatch[2] || urlMatch[3] || '';
    }

    const urlWithoutQuery = result.url.split('?')[0];
    tempCommand = tempCommand.replace(urlWithoutQuery, '').replace(result.url, '');

    const methodMatch = tempCommand.match(/-X\s+(\w+)|--request\s+(\w+)/i);
    if (methodMatch) {
      result.method = (methodMatch[1] || methodMatch[2]).toUpperCase();
    }

    const headerRegex = /-H\s+(?:'([^']+)'|"([^"]+)")/g;
    let headerMatch;
    while ((headerMatch = headerRegex.exec(tempCommand)) !== null) {
      const headerLine = headerMatch[1] || headerMatch[2];
      const colonIndex = headerLine.indexOf(':');
      if (colonIndex !== -1) {
        const key = headerLine.substring(0, colonIndex).trim();
        const value = headerLine.substring(colonIndex + 1).trim();
        result.headers[key] = value;
      }
    }

    const dataMatch = tempCommand.match(/--data(-raw)?\s*=\s*(?:'([^']+)'|"([^"]+)"|(\S+))/);
    if (dataMatch) {
      result.body = dataMatch[2] || dataMatch[3] || dataMatch[4] || '';
    } else {
      const dataRawMatch = tempCommand.match(/--data-raw\s+(?:'([^']+)'|"([^"]+)"|(\S+))/);
      if (dataRawMatch) {
        result.body = dataRawMatch[1] || dataRawMatch[2] || dataRawMatch[3] || '';
      }
    }

    const bodyArgMatch = tempCommand.match(/-d\s+(?:'([^']+)'|"([^"]+)"|(\S+))/);
    if (bodyArgMatch && !result.body) {
      result.body = bodyArgMatch[1] || bodyArgMatch[2] || bodyArgMatch[3] || '';
    }

    return result;
  };

  const generateFetchCode = (parsed: ParsedCurl): string => {
    const headersObj = Object.entries(parsed.headers).reduce((acc, [key, value]) => {
      return `${acc}  '${key}': '${value}',\n`;
    }, '');

    const bodyPart = parsed.body
      ? `,\n    body: JSON.stringify(${parsed.body})`
      : '';

    return `fetch('${parsed.url}', {
  method: '${parsed.method}',
  headers: {
${headersObj.trimEnd()}
  }${bodyPart}
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;
  };

  const generateAxiosCode = (parsed: ParsedCurl): string => {
    const headersObj = Object.entries(parsed.headers).reduce((acc, [key, value]) => {
      return `${acc}    '${key}': '${value}',\n`;
    }, '');

    const bodyPart = parsed.body
      ? `,\n    data: ${parsed.body}`
      : '';

    return `await axios({
  method: '${parsed.method.toLowerCase()}',
  url: '${parsed.url}',${bodyPart}
  headers: {
${headersObj.trimEnd()}
  }
})
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));`;
  };

  const handleConvert = () => {
    setError('');
    setGeneratedCode('');

    if (!curlInput.trim()) {
      setError('请输入cURL命令');
      return;
    }

    try {
      const parsed = parseCurlCommand(curlInput);

      if (!parsed.url) {
        setError('无法解析URL，请检查cURL命令格式');
        return;
      }

      const code = outputFormat === 'fetch' ? generateFetchCode(parsed) : generateAxiosCode(parsed);
      setGeneratedCode(code);
    } catch {
      setError('解析cURL命令时发生错误');
    }
  };

  const handleClear = () => {
    setCurlInput('');
    setGeneratedCode('');
    setError('');
  };

  const handleCopy = async () => {
    if (generatedCode) {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const loadExample = () => {
    setCurlInput(`curl -X POST 'https://api.example.com/users' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer your-token-here' \\
  -d '{"name": "John Doe", "email": "john@example.com"}'`);
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">cURL转Fetch</h2>
        <p className="text-muted-foreground text-lg">
          将cURL命令转换为JavaScript fetch()或Axios代码
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                cURL命令
              </label>
              <button
                onClick={loadExample}
                className="text-sm text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <FileCode className="w-3 h-3" />
                加载示例
              </button>
            </div>
            <textarea
              value={curlInput}
              onChange={(e) => setCurlInput(e.target.value)}
              placeholder="粘贴cURL命令..."
              className="w-full h-40 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm resize-none"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleConvert}
              className="px-6 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
              转换
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              清空
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setOutputFormat('fetch')}
                className={cn(
                  "px-4 py-2 rounded-xl font-medium transition-all",
                  outputFormat === 'fetch'
                    ? "bg-green-500 text-white shadow-md shadow-green-500/20"
                    : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                fetch()
              </button>
              <button
                onClick={() => setOutputFormat('axios')}
                className={cn(
                  "px-4 py-2 rounded-xl font-medium transition-all",
                  outputFormat === 'axios'
                    ? "bg-yellow-500 text-white shadow-md shadow-yellow-500/20"
                    : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                Axios
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {generatedCode && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">
                  生成的代码
                </label>
                <button
                  onClick={handleCopy}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      复制代码
                    </>
                  )}
                </button>
              </div>
              <pre className="w-full p-4 rounded-xl bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 overflow-x-auto">
                <code className="text-sm font-mono text-foreground whitespace-pre">{generatedCode}</code>
              </pre>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <h4 className="text-sm font-medium mb-2 text-foreground">支持的功能</h4>
              <ul className="space-y-1">
                <li>• HTTP方法: GET, POST, PUT, DELETE, PATCH等</li>
                <li>• 自定义请求头</li>
                <li>• JSON请求体</li>
                <li>• 多种输出格式: fetch() 和 Axios</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2 text-foreground">使用提示</h4>
              <ul className="space-y-1">
                <li>• 从浏览器开发者工具复制cURL</li>
                <li>• 支持单行和多行格式</li>
                <li>• 点击&quot;转换&quot;生成代码</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
