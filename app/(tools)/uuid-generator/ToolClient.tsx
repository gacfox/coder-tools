'use client';

import { useState, useEffect } from 'react';
import { Copy, RotateCcw, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type UUIDFormat = 'standard' | 'uppercase' | 'no-dashes' | 'with-braces' | 'urn';

export default function UUIDGenerator() {
  const [uuid, setUuid] = useState<string>('');
  const [batchCount, setBatchCount] = useState<number>(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [format, setFormat] = useState<UUIDFormat>('standard');
  const [copied, setCopied] = useState<string | null>(null);

  // Generate a single UUID in the selected format
  const generateSingleUUID = (): string => {
    const newUuid = crypto.randomUUID();
    return formatUuid(newUuid, format);
  };

  // Format UUID according to selected format
  const formatUuid = (uuid: string, format: UUIDFormat): string => {
    switch (format) {
      case 'uppercase':
        return uuid.toUpperCase();
      case 'no-dashes':
        return uuid.replace(/-/g, '');
      case 'with-braces':
        return `{${uuid}}`;
      case 'urn':
        return `urn:uuid:${uuid}`;
      case 'standard':
      default:
        return uuid;
    }
  };

  // Generate UUIDs based on batch count
  const generateUUIDs = () => {
    const count = Math.min(Math.max(batchCount, 1), 1000); // Limit between 1 and 1000
    const newUuids = Array.from({ length: count }, () => generateSingleUUID());
    setUuids(newUuids);
    
    // If only one UUID, also set it as the single UUID
    if (count === 1) {
      setUuid(newUuids[0]);
    }
  };

  // Generate a single UUID on initial load
  useEffect(() => {
    setUuid(crypto.randomUUID());
  }, []);

  // Regenerate when format changes
  useEffect(() => {
    if (uuid) {
      setUuid(formatUuid(uuid, format));
    }
    if (uuids.length > 0) {
      setUuids(uuids.map(u => formatUuid(u, format)));
    }
  }, [format]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAllUuids = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied('all');
    setTimeout(() => setCopied(null), 2000);
  };

  const resetGenerator = () => {
    setUuid(crypto.randomUUID());
    setBatchCount(1);
    setUuids([]);
    setFormat('standard');
    setCopied(null);
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">UUIDv4生成器</h2>
        <p className="text-muted-foreground text-lg">
          生成符合RFC 4122标准的UUID v4
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">UUID格式</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as UUIDFormat)}
                  className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                >
                  <option value="standard">标准格式 (xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)</option>
                  <option value="uppercase">大写版本</option>
                  <option value="no-dashes">无连字符 (32个字符)</option>
                  <option value="with-braces">带大括号 {'{xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx}'}</option>
                  <option value="urn">URN格式 urn:uuid:xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">生成数量 (1-1000)</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={batchCount}
                  onChange={(e) => setBatchCount(Math.min(Math.max(parseInt(e.target.value) || 1, 1), 1000))}
                  className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={generateUUIDs}
                className="px-4 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 flex-1"
              >
                <RotateCw className="w-4 h-4" />
                {batchCount > 1 ? '批量生成UUID' : '生成UUID'}
              </button>
              <button
                onClick={resetGenerator}
                className="px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {uuids.length === 0 && uuid && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-muted-foreground">生成的UUID</label>
                <button
                  onClick={() => copyToClipboard(uuid, 'single')}
                  className="text-sm px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  复制
                </button>
              </div>
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 break-all text-sm font-mono">
                {uuid}
              </div>
              {copied === 'single' && (
                <div className="text-xs text-green-600 dark:text-green-400">已复制！</div>
              )}
            </div>
          )}

          {uuids.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">生成的UUIDs ({uuids.length})</h3>
                <button
                  onClick={copyAllUuids}
                  className="text-sm px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  复制全部
                </button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto p-2">
                {uuids.map((u, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground min-w-[30px]">{index + 1}.</div>
                    <div className="flex-1 p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 break-all text-sm font-mono">
                      {u}
                    </div>
                    <button
                      onClick={() => copyToClipboard(u, `uuid-${index}`)}
                      className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              {copied === 'all' && (
                <div className="text-xs text-green-600 dark:text-green-400 text-center">全部UUID已复制到剪贴板！</div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 选择所需的UUID格式（标准、大写、无连字符等）</li>
            <li>• 设置生成数量（1-1000个）</li>
            <li>• 点击"生成UUID"按钮创建UUID</li>
            <li>• 单个UUID可单独复制，批量生成时可复制全部</li>
            <li>• 使用重置按钮清空所有结果</li>
          </ul>
        </div>
      </div>
    </>
  );
}