'use client';

import { useState, useEffect, useRef } from 'react';
import { format, supportedDialects } from 'sql-formatter';
import { Copy, RotateCcw, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism-tomorrow.css';

type KeywordCase = 'preserve' | 'upper' | 'lower';
type Dialect = 'sql' | 'mysql' | 'postgresql' | 'bigquery' | 'db2' | 'db2i' | 'duckdb' | 'hive' | 'mariadb' | 'tidb' | 'sqlite' | 'plsql' | 'n1ql' | 'redshift' | 'spark' | 'trino' | 'transactsql' | 'singlestoredb' | 'snowflake' | 'tsql';

interface FormatOptions {
  language?: Dialect;
  tabWidth?: number;
  keywordCase?: KeywordCase;
  linesBetweenQueries?: number;
}

export default function SQLFormatter() {
  const [inputSQL, setInputSQL] = useState<string>('');
  const [formattedSQL, setFormattedSQL] = useState<string>('');
  const [keywordCase, setKeywordCase] = useState<KeywordCase>('upper');
  const [indentWidth, setIndentWidth] = useState<number>(4);
  const [minify, setMinify] = useState<boolean>(false);
  const [dialect, setDialect] = useState<Dialect>('sql');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const codeRef = useRef<HTMLElement>(null);

  const formatSQL = () => {
    setError(null);
    try {
      if (!inputSQL.trim()) {
        setFormattedSQL('');
        return;
      }

      let result;
      if (minify) {
        // For minify mode, format with minimal settings and then remove extra whitespace
        result = format(inputSQL, {
          language: dialect,
        }).replace(/\s+/g, ' ').trim();
      } else {
        // For normal mode, apply all formatting options
        const options: FormatOptions = {
          language: dialect,
          tabWidth: indentWidth,
          keywordCase,
        };

        result = format(inputSQL, options);
      }

      setFormattedSQL(result);
    } catch (err) {
      // Even if there's an error, try to format the SQL to avoid throwing errors
      try {
        setFormattedSQL(format(inputSQL));
      } catch {
        // If all formatting attempts fail, just set the original input
        setFormattedSQL(inputSQL);
        setError('SQL格式化失败，显示原始内容');
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedSQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearInput = () => {
    setInputSQL('');
    setFormattedSQL('');
    setKeywordCase('upper');
    setIndentWidth(4);
    setMinify(false);
    setDialect('sql');
    setError(null);
  };

  // Apply syntax highlighting when formattedSQL changes
  useEffect(() => {
    if (formattedSQL && codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [formattedSQL]);

  // Format SQL when input or options change
  useEffect(() => {
    if (inputSQL) {
      formatSQL();
    } else {
      setFormattedSQL('');
    }
  }, [inputSQL, keywordCase, indentWidth, minify, dialect]);

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">SQL格式化工具</h2>
        <p className="text-muted-foreground text-lg">
          格式化和美化SQL查询语句
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">输入SQL</label>
              <textarea
                value={inputSQL}
                onChange={(e) => setInputSQL(e.target.value)}
                placeholder="在此粘贴或输入SQL查询..."
                className="w-full h-40 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">关键字大小写</label>
                <select
                  value={keywordCase}
                  onChange={(e) => setKeywordCase(e.target.value as KeywordCase)}
                  className="w-full p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                >
                  <option value="upper">大写 (UPPERCASE)</option>
                  <option value="lower">小写 (lowercase)</option>
                  <option value="preserve">保持原样</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">缩进宽度</label>
                <select
                  value={indentWidth}
                  onChange={(e) => setIndentWidth(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                >
                  <option value={2}>2个空格</option>
                  <option value={4}>4个空格 (默认)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">SQL方言</label>
                <select
                  value={dialect}
                  onChange={(e) => setDialect(e.target.value as Dialect)}
                  className="w-full p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                >
                  <option value="sql">Standard SQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="postgresql">PostgreSQL</option>
                  <option value="transactsql">SQL Server</option>
                  <option value="db2">DB2</option>
                  <option value="plsql">PL/SQL</option>
                  <option value="n1ql">N1QL</option>
                  <option value="redshift">Redshift</option>
                  <option value="spark">Spark</option>
                  <option value="trino">Trino</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">压缩模式</label>
                <div className="flex items-center pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={minify}
                      onChange={(e) => setMinify(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={formatSQL}
                className="px-4 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 flex-1"
              >
                <RotateCw className="w-4 h-4" />
                格式化SQL
              </button>
              <button
                onClick={clearInput}
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

          {formattedSQL && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-muted-foreground">格式化结果</label>
                <button
                  onClick={copyToClipboard}
                  className="text-sm px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  复制
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 overflow-auto max-h-96 text-sm">
                <code ref={codeRef} className="language-sql">{formattedSQL}</code>
              </pre>
              {copied && (
                <div className="text-xs text-green-600 dark:text-green-400 text-center">已复制到剪贴板！</div>
              )}
            </div>
          )}

          {!formattedSQL && inputSQL && !error && (
            <div className="text-center text-muted-foreground py-8">
              <p>正在格式化SQL...</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 在输入框中粘贴或输入SQL查询语句</li>
            <li>• 选择所需的格式化选项（关键字大小写、缩进、方言等）</li>
            <li>• 点击"格式化SQL"按钮美化SQL语句</li>
            <li>• 使用"压缩模式"生成单行紧凑SQL</li>
            <li>• 点击"复制"按钮将格式化后的SQL复制到剪贴板</li>
          </ul>
        </div>
      </div>
    </>
  );
}