'use client';

import { useEffect, useMemo, useState } from 'react';
import { Clock, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface City {
  label: string;
  timezone: string;
}

interface TimeRow extends City {
  local: string;
  offset: string;
  diff: string;
  isSource: boolean;
}

const CITIES: City[] = [
  { label: '北京 / 上海（中国）', timezone: 'Asia/Shanghai' },
  { label: '香港', timezone: 'Asia/Hong_Kong' },
  { label: '台北', timezone: 'Asia/Taipei' },
  { label: '东京（日本）', timezone: 'Asia/Tokyo' },
  { label: '首尔（韩国）', timezone: 'Asia/Seoul' },
  { label: '新加坡', timezone: 'Asia/Singapore' },
  { label: '曼谷（泰国）', timezone: 'Asia/Bangkok' },
  { label: '新德里（印度）', timezone: 'Asia/Kolkata' },
  { label: '迪拜（阿联酋）', timezone: 'Asia/Dubai' },
  { label: '莫斯科（俄罗斯）', timezone: 'Europe/Moscow' },
  { label: '柏林（德国）', timezone: 'Europe/Berlin' },
  { label: '巴黎（法国）', timezone: 'Europe/Paris' },
  { label: '伦敦（英国）', timezone: 'Europe/London' },
  { label: 'UTC 协调世界时', timezone: 'UTC' },
  { label: '圣保罗（巴西）', timezone: 'America/Sao_Paulo' },
  { label: '纽约 / 华盛顿（美东）', timezone: 'America/New_York' },
  { label: '芝加哥（美中）', timezone: 'America/Chicago' },
  { label: '丹佛（美山地）', timezone: 'America/Denver' },
  { label: '洛杉矶 / 旧金山（美西）', timezone: 'America/Los_Angeles' },
  { label: '多伦多（加拿大）', timezone: 'America/Toronto' },
  { label: '温哥华（加拿大）', timezone: 'America/Vancouver' },
  { label: '悉尼（澳大利亚）', timezone: 'Australia/Sydney' },
  { label: '奥克兰（新西兰）', timezone: 'Pacific/Auckland' }
];

const BEIJING_OFFSET_MINUTES = 480;

function getNumericPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): number {
  const value = parts.find((part) => part.type === type)?.value;
  return value ? Number(value) : 0;
}

function getTextPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((part) => part.type === type)?.value ?? '';
}

function getOffsetMinutes(instantMs: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).formatToParts(instantMs);
  const asUtc = Date.UTC(
    getNumericPart(parts, 'year'),
    getNumericPart(parts, 'month') - 1,
    getNumericPart(parts, 'day'),
    getNumericPart(parts, 'hour'),
    getNumericPart(parts, 'minute'),
    getNumericPart(parts, 'second')
  );
  return (asUtc - instantMs) / 60000;
}

function zonedTimeToUtcMs(datetime: string, timeZone: string): number {
  const [datePart, timePart] = datetime.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  const naive = Date.UTC(year, month - 1, day, hour, minute);
  let guess = naive;
  for (let i = 0; i < 2; i++) {
    guess = naive - getOffsetMinutes(guess, timeZone) * 60000;
  }
  return guess;
}

const formatters = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('zh-CN', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short'
    });
    formatters.set(timeZone, formatter);
  }
  return formatter;
}

function formatLocal(instantMs: number, timeZone: string): string {
  const parts = getFormatter(timeZone).formatToParts(instantMs);
  return `${getTextPart(parts, 'year')}-${getTextPart(parts, 'month')}-${getTextPart(parts, 'day')} ${getTextPart(parts, 'hour')}:${getTextPart(parts, 'minute')} ${getTextPart(parts, 'weekday')}`;
}

function formatOffset(offsetMinutes: number): string {
  const sign = offsetMinutes < 0 ? '-' : '+';
  const abs = Math.abs(offsetMinutes);
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  return minutes === 0 ? `UTC${sign}${hours}` : `UTC${sign}${hours}:${minutes}`;
}

function formatDiff(diffMinutes: number): string {
  if (diffMinutes === 0) return '相同';
  const hours = Math.abs(diffMinutes) / 60;
  return `${diffMinutes > 0 ? '快' : '慢'} ${hours} 小时`;
}

function getNowInZone(timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).formatToParts(Date.now());
  return `${getTextPart(parts, 'year')}-${getTextPart(parts, 'month')}-${getTextPart(parts, 'day')}T${getTextPart(parts, 'hour')}:${getTextPart(parts, 'minute')}`;
}

export default function TimezoneConverter() {
  const [datetime, setDatetime] = useState<string>('');
  const [sourceTz, setSourceTz] = useState<string>('Asia/Shanghai');

  useEffect(() => {
    const timer = setTimeout(() => {
      const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const matched = CITIES.find((city) => city.timezone === resolved);
      const tz = matched ? matched.timezone : 'Asia/Shanghai';
      setSourceTz(tz);
      setDatetime(getNowInZone(tz));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const rows = useMemo<TimeRow[]>(() => {
    if (!datetime) {
      return CITIES.map((city) => ({ ...city, local: '—', offset: '—', diff: '—', isSource: false }));
    }
    const instantMs = zonedTimeToUtcMs(datetime, sourceTz);
    return CITIES.map((city) => {
      const offset = getOffsetMinutes(instantMs, city.timezone);
      return {
        ...city,
        local: formatLocal(instantMs, city.timezone),
        offset: formatOffset(offset),
        diff: formatDiff(offset - BEIJING_OFFSET_MINUTES),
        isSource: city.timezone === sourceTz
      };
    });
  }, [datetime, sourceTz]);

  const useCurrentTime = () => {
    setDatetime(getNowInZone(sourceTz));
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">时区转换 / 世界时间</h2>
        <p className="text-muted-foreground text-lg">
          输入一个城市的时间，换算成全球主要城市的当地时间，自动处理夏令时
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="datetime-input" className="text-sm font-medium text-muted-foreground">日期时间</label>
            <input
              id="datetime-input"
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="w-full p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="timezone-select" className="text-sm font-medium text-muted-foreground">所在时区</label>
            <select
              id="timezone-select"
              value={sourceTz}
              onChange={(e) => setSourceTz(e.target.value)}
              className="w-full p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
            >
              {CITIES.map((city) => (
                <option key={city.timezone} value={city.timezone}>{city.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <button
            onClick={useCurrentTime}
            className="px-4 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 flex-1 min-w-[160px]"
          >
            <Clock className="w-4 h-4" />
            使用当前时间
          </button>
          <button
            onClick={useCurrentTime}
            className="px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-8 overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                <th className="px-4 py-3 font-medium">城市 / 时区</th>
                <th className="px-4 py-3 font-medium">当地时间</th>
                <th className="px-4 py-3 font-medium">UTC偏移</th>
                <th className="px-4 py-3 font-medium">与北京时差</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.timezone}
                  className={cn(
                    'border-b border-black/5 dark:border-white/5 last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors',
                    row.isSource && 'bg-blue-500/5 dark:bg-blue-400/10'
                  )}
                >
                  <td className={cn('px-4 py-2.5 whitespace-nowrap', row.isSource && 'font-medium')}>{row.label}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap font-mono text-xs">{row.local}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap font-mono text-xs">{row.offset}</td>
                  <td className={cn('px-4 py-2.5 whitespace-nowrap', row.diff === '相同' && 'text-green-600 dark:text-green-400')}>{row.diff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-sm text-muted-foreground">
          夏令时由浏览器内置的时区数据库自动计算。中国全境统一使用北京时间（UTC+8），没有夏令时。
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 输入日期时间并选择其所在时区，下方表格显示全球主要城市的当地时间</li>
            <li>• 点击“使用当前时间”按钮快速填入所选时区的当前时刻</li>
            <li>• UTC偏移按所选时刻计算，夏令时（如美东、欧洲）自动切换</li>
            <li>• “与北京时差”以北京时间（UTC+8）为基准，“快”表示比北京早，“慢”表示比北京晚</li>
          </ul>
        </div>
      </div>
    </>
  );
}
