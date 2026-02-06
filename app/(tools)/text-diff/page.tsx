'use client';

import { useState, useEffect } from 'react';
import { Copy, RotateCcw, Download, FileText, Diff } from 'lucide-react';
import { cn } from '@/lib/utils';

// Improved diff algorithm to find differences between two texts
const calculateDiff = (text1: string, text2: string) => {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');

  const m = lines1.length;
  const n = lines2.length;

  // Create a matrix to store the length of common subsequence
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  // Fill the matrix using dynamic programming
  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      if (i === 0) {
        dp[i][j] = j; // If first string is empty, insert all chars from second string
      } else if (j === 0) {
        dp[i][j] = i; // If second string is empty, remove all chars from first string
      } else if (lines1[i - 1] === lines2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]; // Characters match, no operation needed
      } else {
        // Take minimum of insert, remove, or replace operations
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // Remove from first string
          dp[i][j - 1],     // Insert from second string
          dp[i - 1][j - 1]  // Replace
        );
      }
    }
  }

  // Backtrack to find the actual operations
  let i = m;
  let j = n;
  const diff: { type: 'common' | 'added' | 'removed', content: string }[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
      // Characters match, add as common
      diff.unshift({ type: 'common', content: lines1[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      // Insert from second string
      diff.unshift({ type: 'added', content: lines2[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      // Remove from first string
      diff.unshift({ type: 'removed', content: lines1[i - 1] });
      i--;
    }
  }

  return diff;
};

export default function TextDiff() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffResult, setDiffResult] = useState<{ type: 'common' | 'added' | 'removed', content: string }[]>([]);
  const [diffStats, setDiffStats] = useState({ added: 0, removed: 0, unchanged: 0 });

  useEffect(() => {
    if (text1 !== undefined && text2 !== undefined) {
      const diff = calculateDiff(text1, text2);
      setDiffResult(diff);

      // Calculate stats
      const stats = { added: 0, removed: 0, unchanged: 0 };
      diff.forEach(item => {
        if (item.type === 'added') stats.added++;
        else if (item.type === 'removed') stats.removed++;
        else stats.unchanged++;
      });
      setDiffStats(stats);
    }
  }, [text1, text2]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadDiff = () => {
    const content = `文本差异对比结果：

原文本：
${text1}

新文本：
${text2}

差异统计：
新增行数: ${diffStats.added}
删除行数: ${diffStats.removed}
未变化行数: ${diffStats.unchanged}

详细差异：
${diffResult.map(item => `[${item.type}] ${item.content}`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text_diff_result.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setText1('');
    setText2('');
  };

  const swapTexts = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">文本差异对比工具</h2>
        <p className="text-muted-foreground text-lg">
          高亮显示两段文本之间的差异
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">原文本</label>
                <button
                  onClick={() => copyToClipboard(text1)}
                  disabled={!text1}
                  className={cn(
                    "text-xs px-2 py-1 rounded-lg transition-colors",
                    text1
                      ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Copy className="w-3 h-3 inline mr-1" />
                  复制
                </button>
              </div>
              <textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="请输入原文本..."
                className="w-full h-64 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">新文本</label>
                <button
                  onClick={() => copyToClipboard(text2)}
                  disabled={!text2}
                  className={cn(
                    "text-xs px-2 py-1 rounded-lg transition-colors",
                    text2
                      ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Copy className="w-3 h-3 inline mr-1" />
                  复制
                </button>
              </div>
              <textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="请输入新文本..."
                className="w-full h-64 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={swapTexts}
              className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              交换文本
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              清空
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">差异对比结果</label>
              <div className="flex gap-2">
                <div className="text-xs px-2 py-1 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
                  新增: {diffStats.added}
                </div>
                <div className="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                  删除: {diffStats.removed}
                </div>
                <div className="text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  未变: {diffStats.unchanged}
                </div>
                <button
                  onClick={downloadDiff}
                  disabled={diffResult.length === 0}
                  className={cn(
                    "text-xs px-2 py-1 rounded-lg transition-colors flex items-center gap-1",
                    diffResult.length > 0
                      ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Download className="w-3 h-3" />
                  下载
                </button>
              </div>
            </div>
            <div className="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden">
              <div className="bg-black/5 dark:bg-white/5 p-3 border-b border-black/10 dark:border-white/10 text-sm font-medium">
                差异对比结果
              </div>
              <div className="max-h-96 overflow-auto font-mono text-sm">
                {diffResult.length > 0 ? (
                  <div className="p-4 space-y-1">
                    {diffResult.map((item, index) => (
                      <div
                        key={index}
                        className={cn(
                          "py-1 px-2 rounded",
                          item.type === 'added' && 'bg-green-500/20 dark:bg-green-500/10',
                          item.type === 'removed' && 'bg-red-500/20 dark:bg-red-500/10',
                          item.type === 'common' && 'bg-transparent'
                        )}
                      >
                        <span className={cn(
                          "text-xs font-medium mr-2 px-1.5 py-0.5 rounded",
                          item.type === 'added' && 'bg-green-500/30 text-green-700 dark:text-green-300',
                          item.type === 'removed' && 'bg-red-500/30 text-red-700 dark:text-red-300',
                          item.type === 'common' && 'bg-gray-500/20 text-gray-500 dark:text-gray-400'
                        )}>
                          {item.type === 'added' ? '+ 新增' : item.type === 'removed' ? '- 删除' : '  '}
                        </span>
                        <span className="whitespace-pre-wrap break-words">{item.content}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground italic">
                    请输入两段文本以查看差异对比结果
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 在"原文本"框中输入第一段文本</li>
            <li>• 在"新文本"框中输入第二段文本</li>
            <li>• 系统会自动对比两段文本并高亮显示差异</li>
            <li>• 绿色背景表示新增内容，红色背景表示删除内容</li>
            <li>• 点击"交换文本"可快速交换两段文本内容</li>
          </ul>
        </div>
      </div>
    </>
  );
}