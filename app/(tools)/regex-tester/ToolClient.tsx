'use client';

import { useState, useEffect } from 'react';
import { Copy, RotateCcw, Download, Search, Mail, Globe, Network } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RegexTester() {
  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('g'); // Default to global flag for highlighting
  const [text, setText] = useState('');
  const [matches, setMatches] = useState<{ match: string; index: number }[]>([]);
  const [error, setError] = useState('');
  const [matchCount, setMatchCount] = useState(0);

  // Common regex presets
  const presets = [
    { name: 'Email', regex: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', description: '匹配电子邮件地址' },
    { name: 'URL', regex: 'https?://[\\w\\.-]+\\.[a-zA-Z]{2,}(/[\\w/\\.-]*)?', description: '匹配URL地址' },
    { name: 'IP地址', regex: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b', description: '匹配IPv4地址' },
    { name: '电话号码', regex: '\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b', description: '匹配电话号码格式' },
    { name: '日期', regex: '\\b\\d{4}[-/]\\d{1,2}[-/]\\d{1,2}\\b', description: '匹配日期格式 (YYYY-MM-DD 或 YYYY/MM/DD)' },
    { name: '信用卡号', regex: '\\b\\d{4}[ -]?\\d{4}[ -]?\\d{4}[ -]?\\d{4}\\b', description: '匹配信用卡号格式' }
  ];

  // Function to apply regex and find matches
  useEffect(() => {
    if (!regex) {
      setMatches([]);
      setError('');
      setMatchCount(0);
      return;
    }

    try {
      // Create a global regex with the provided flags
      const globalFlags = flags.includes('g') ? flags : flags + 'g';
      const regexObj = new RegExp(regex, globalFlags);
      
      // Find all matches
      const foundMatches = [];
      let match;
      let lastIndex = 0;
      
      // Reset lastIndex in case it's sticky
      regexObj.lastIndex = 0;
      
      while ((match = regexObj.exec(text)) !== null) {
        foundMatches.push({
          match: match[0],
          index: match.index
        });
        
        // Prevent infinite loop for zero-length matches
        if (match.index === regexObj.lastIndex) {
          regexObj.lastIndex++;
        }
      }
      
      setMatches(foundMatches);
      setMatchCount(foundMatches.length);
      setError('');
    } catch (err) {
      setError(`正则表达式错误: ${(err as Error).message}`);
      setMatches([]);
      setMatchCount(0);
    }
  }, [regex, flags, text]);

  const handlePresetClick = (presetRegex: string) => {
    setRegex(presetRegex);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copyMatches = () => {
    const matchText = matches.map(m => m.match).join('\n');
    copyToClipboard(matchText);
  };

  const downloadResults = () => {
    const content = `正则表达式: ${regex}
标志: ${flags}
匹配数量: ${matchCount}
匹配结果:
${matches.map((m, i) => `${i + 1}. ${m.match}`).join('\n')}
全文:
${text}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'regex_test_results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setRegex('');
    setText('');
    setFlags('g');
    setError('');
  };

  // Function to highlight matches in text
  const highlightMatches = () => {
    if (!regex || matches.length === 0) {
      return <span>{text}</span>;
    }

    const result = [];
    let lastIndex = 0;

    matches.forEach((match, index) => {
      // Add text before match
      if (match.index > lastIndex) {
        result.push(text.substring(lastIndex, match.index));
      }
      
      // Add highlighted match
      result.push(
        <mark key={index} className="bg-yellow-300 dark:bg-yellow-700 px-0.5 rounded">
          {match.match}
        </mark>
      );
      
      lastIndex = match.index + match.match.length;
    });

    // Add remaining text after last match
    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }

    return <span>{result}</span>;
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">正则表达式测试工具</h2>
        <p className="text-muted-foreground text-lg">
          实时测试正则表达式并高亮显示匹配结果
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-muted-foreground">正则表达式</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={regex}
                    onChange={(e) => setRegex(e.target.value)}
                    placeholder="输入正则表达式..."
                    className="w-full pl-10 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div className="w-32 space-y-2">
                <label className="text-sm font-medium text-muted-foreground">标志</label>
                <input
                  type="text"
                  value={flags}
                  onChange={(e) => setFlags(e.target.value)}
                  placeholder="g, i, m..."
                  className="w-full p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">预设正则</label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handlePresetClick(preset.regex)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5"
                    title={preset.description}
                  >
                    {preset.name === 'Email' && <Mail className="w-3 h-3" />}
                    {preset.name === 'URL' && <Globe className="w-3 h-3" />}
                    {preset.name === 'IP地址' && <Network className="w-3 h-3" />}
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">目标文本</label>
              <button
                onClick={() => copyToClipboard(text)}
                disabled={!text}
                className={cn(
                  "text-xs px-2 py-1 rounded-lg transition-colors flex items-center gap-1",
                  text 
                    ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10" 
                    : "opacity-50 cursor-not-allowed"
                )}
              >
                <Copy className="w-3 h-3" />
                复制文本
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入要测试的文本..."
              className="w-full h-40 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">匹配结果</label>
              <div className="flex gap-2">
                <button
                  onClick={copyMatches}
                  disabled={matchCount === 0}
                  className={cn(
                    "text-xs px-2 py-1 rounded-lg transition-colors flex items-center gap-1",
                    matchCount > 0
                      ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10" 
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Copy className="w-3 h-3" />
                  复制匹配
                </button>
                <button
                  onClick={downloadResults}
                  disabled={matchCount === 0}
                  className={cn(
                    "text-xs px-2 py-1 rounded-lg transition-colors flex items-center gap-1",
                    matchCount > 0
                      ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10" 
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Download className="w-3 h-3" />
                  下载结果
                </button>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 min-h-[100px]">
              {text ? (
                <div className="whitespace-pre-wrap break-words font-mono text-sm">
                  {highlightMatches()}
                </div>
              ) : (
                <p className="text-muted-foreground italic">输入文本以查看匹配结果</p>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              匹配数量: <span className="font-medium">{matchCount}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={clearAll}
              className="px-6 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              清空
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 在"正则表达式"框中输入要测试的正则表达式</li>
            <li>• 在"标志"框中输入正则标志（如 g, i, m 等）</li>
            <li>• 点击预设按钮可快速填充常用正则表达式</li>
            <li>• 在"目标文本"框中输入要匹配的文本</li>
            <li>• 匹配结果会实时高亮显示在下方区域</li>
          </ul>
        </div>
      </div>
    </>
  );
}