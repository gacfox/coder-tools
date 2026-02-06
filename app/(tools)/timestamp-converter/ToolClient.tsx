'use client';

import { useState, useEffect } from 'react';
import { RotateCcw, Calendar, Clock, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TimestampConverter() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [iso8601, setIso8601] = useState<string>('');
  const [customFormat, setCustomFormat] = useState<string>('');
  const [unixTimestamp, setUnixTimestamp] = useState<number>(0);
  const [copied, setCopied] = useState<string | null>(null);

  // Initialize with current date/time
  useEffect(() => {
    const now = new Date();
    updateTimestamp(now);
  }, []);

  const updateTimestamp = (date: Date) => {
    const ts = date.getTime();
    setTimestamp(ts);
    setIso8601(date.toISOString());
    setCustomFormat(formatDate(date));
    setUnixTimestamp(Math.floor(ts / 1000));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    
    if (date && selectedTime) {
      const dateTime = new Date(`${date}T${selectedTime}`);
      updateTimestamp(dateTime);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    setSelectedTime(time);
    
    if (selectedDate && time) {
      const dateTime = new Date(`${selectedDate}T${time}`);
      updateTimestamp(dateTime);
    }
  };

  const useCurrentTime = () => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().substring(0, 5);
    
    setSelectedDate(dateStr);
    setSelectedTime(timeStr);
    updateTimestamp(now);
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const resetConverter = () => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().substring(0, 5);
    
    setSelectedDate(dateStr);
    setSelectedTime(timeStr);
    updateTimestamp(now);
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">时间戳工具</h2>
        <p className="text-muted-foreground text-lg">
          时间与时间戳转换工具
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">选择日期</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-full p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">选择时间</label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    className="w-full p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={useCurrentTime}
                    className="px-4 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 flex-1"
                  >
                    <Clock className="w-4 h-4" />
                    使用当前时间
                  </button>
                  <button
                    onClick={resetConverter}
                    className="px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">转换结果</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-muted-foreground">ISO 8601 / RFC 3339</label>
                      <button
                        onClick={() => copyToClipboard(iso8601, 'iso8601')}
                        className="text-sm px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        复制
                      </button>
                    </div>
                    <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 break-all text-sm font-mono">
                      {iso8601}
                    </div>
                    {copied === 'iso8601' && (
                      <div className="text-xs text-green-600 dark:text-green-400">已复制！</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-muted-foreground">yyyy-MM-dd HH:mm:ss</label>
                      <button
                        onClick={() => copyToClipboard(customFormat, 'custom')}
                        className="text-sm px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        复制
                      </button>
                    </div>
                    <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 break-all text-sm font-mono">
                      {customFormat}
                    </div>
                    {copied === 'custom' && (
                      <div className="text-xs text-green-600 dark:text-green-400">已复制！</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-muted-foreground">Unix时间戳 (秒)</label>
                      <button
                        onClick={() => copyToClipboard(unixTimestamp.toString(), 'unix')}
                        className="text-sm px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        复制
                      </button>
                    </div>
                    <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 break-all text-sm font-mono">
                      {unixTimestamp}
                    </div>
                    {copied === 'unix' && (
                      <div className="text-xs text-green-600 dark:text-green-400">已复制！</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-muted-foreground">Unix时间戳 (毫秒)</label>
                      <button
                        onClick={() => copyToClipboard(timestamp.toString(), 'timestamp')}
                        className="text-sm px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        复制
                      </button>
                    </div>
                    <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 break-all text-sm font-mono">
                      {timestamp}
                    </div>
                    {copied === 'timestamp' && (
                      <div className="text-xs text-green-600 dark:text-green-400">已复制！</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 使用日期和时间选择器选择一个时间点</li>
            <li>• 点击"使用当前时间"按钮快速选择当前时间</li>
            <li>• 右侧将显示所选时间的多种格式转换结果</li>
            <li>• 点击"复制"按钮将格式化的时间复制到剪贴板</li>
          </ul>
        </div>
      </div>
    </>
  );
}