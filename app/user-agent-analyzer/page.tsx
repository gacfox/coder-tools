'use client';

import { useState } from 'react';
import { UAParser } from 'ua-parser-js';
import { Copy, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UserAgentAnalyzer() {
  const [userAgent, setUserAgent] = useState('');
  const [result, setResult] = useState<UAParser.IResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const handleParse = () => {
    setError('');
    setCopied(null);

    if (!userAgent.trim()) {
      setError('请输入User-Agent字符串');
      setResult(null);
      return;
    }

    try {
      const parser = new UAParser(userAgent);
      const result = parser.getResult();
      setResult(result);
    } catch (err) {
      setError('解析User-Agent字符串失败');
      setResult(null);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleGetMyUA = () => {
    setUserAgent(navigator.userAgent);
  };

  const resetAnalyzer = () => {
    setUserAgent('');
    setResult(null);
    setError('');
    setCopied(null);
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">User-Agent分析</h2>
        <p className="text-muted-foreground text-lg">
          解析和分析User-Agent字符串
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">输入User-Agent字符串</label>
              <input
                type="text"
                value={userAgent}
                onChange={(e) => setUserAgent(e.target.value)}
                placeholder="输入User-Agent字符串进行分析"
                className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleParse}
                className="px-4 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 flex-1"
              >
                解析
              </button>
              <button
                onClick={handleGetMyUA}
                className="px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                使用我的UA
              </button>
              <button
                onClick={resetAnalyzer}
                className="px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">分析结果</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Browser Card */}
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-muted-foreground">浏览器</label>
                    </div>
                    <p className="text-lg font-medium">
                      {result.browser.name} {result.browser.version}
                    </p>
                  </div>

                  {/* Engine Card */}
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-muted-foreground">引擎</label>
                    </div>
                    <p className="text-lg font-medium">
                      {result.engine.name} {result.engine.version}
                    </p>
                  </div>

                  {/* OS Card */}
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-muted-foreground">操作系统</label>
                    </div>
                    <p className="text-lg font-medium">
                      {result.os.name} {result.os.version}
                    </p>
                  </div>

                  {/* Device Card */}
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-muted-foreground">设备</label>
                    </div>
                    <p className="text-lg font-medium">
                      {result.device.type || 'desktop'} | {result.device.vendor || 'Unknown'} | {result.device.model || 'Unknown'}
                    </p>
                  </div>

                  {/* CPU Card */}
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-muted-foreground">CPU架构</label>
                    </div>
                    <p className="text-lg font-medium">
                      {result.cpu.architecture || 'Unknown'}
                    </p>
                  </div>

                  {/* Bot Card */}
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-muted-foreground">机器人/爬虫</label>
                    </div>
                    <p className="text-lg font-medium">
                      {result.browser.name?.toLowerCase().includes('bot') ||
                       result.browser.name?.toLowerCase().includes('crawler') ||
                       result.engine.name?.toLowerCase().includes('bot') ||
                       result.engine.name?.toLowerCase().includes('crawler')
                       ? '是' : '否'}
                    </p>
                  </div>
                </div>

                {/* Original UA Card */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-muted-foreground">原始User-Agent</label>
                    <button
                      onClick={() => handleCopy(userAgent, 'ua')}
                      className="text-sm px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      复制
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 break-all text-sm font-mono">
                    {userAgent}
                  </div>
                  {copied === 'ua' && (
                    <div className="text-xs text-green-600 dark:text-green-400">已复制！</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!result && !error && (
            <div className="text-center text-muted-foreground py-8">
              <p>输入User-Agent字符串并点击"解析"进行分析</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 在输入框中粘贴或输入User-Agent字符串</li>
            <li>• 点击"解析"按钮分析User-Agent信息</li>
            <li>• 点击"使用我的UA"快速获取当前浏览器的User-Agent</li>
            <li>• 点击"复制"按钮复制原始User-Agent字符串</li>
          </ul>
        </div>
      </div>
    </>
  );
}