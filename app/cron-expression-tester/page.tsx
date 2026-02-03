'use client';

import { useState } from 'react';
import { Play, RotateCcw, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CronExpressionParser } from 'cron-parser';

type CronType = 'linux' | 'quartz';

interface NextExecution {
  date: Date;
  formatted: string;
}

export default function CronExpressionTester() {
  const [cronExpression, setCronExpression] = useState('');
  const [cronType, setCronType] = useState<CronType>('linux');
  const [startDate, setStartDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [nextExecutions, setNextExecutions] = useState<NextExecution[]>([]);
  const [error, setError] = useState('');

  const getDefaultCron = (type: CronType): string => {
    if (type === 'linux') {
      return '0 0 * * *';
    }
    return '0 0 0 * * ?';
  };

  const handleTypeChange = (type: CronType) => {
    setCronType(type);
    setCronExpression(getDefaultCron(type));
    setError('');
    setNextExecutions([]);
  };

  const formatDateTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
    return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds} 星期${week}`;
  };

  const handleTest = async () => {
    setError('');
    setNextExecutions([]);

    if (!cronExpression.trim()) {
      setError('请输入Cron表达式');
      return;
    }

    try {
      const now = new Date();
      const options: Record<string, unknown> = {
        iterator: true,
        currentDate: startDate && startTime ? new Date(`${startDate}T${startTime}`) : now,
      };

      if (cronType === 'quartz') {
        options.second = true;
      }

      const interval = CronExpressionParser.parse(cronExpression, options as Parameters<typeof CronExpressionParser.parse>[1]);
      const executions: NextExecution[] = [];

      for (let i = 0; i < 5; i++) {
        const result = interval.next();
        executions.push({
          date: result.toDate(),
          formatted: formatDateTime(result.toDate()),
        });
      }

      setNextExecutions(executions);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('Invalid')) {
          setError('无效的Cron表达式，请检查格式');
        } else if (err.message.includes('out of range')) {
          setError('表达式值超出范围');
        } else {
          setError(`解析错误：${err.message}`);
        }
      } else {
        setError('解析Cron表达式时发生未知错误');
      }
    }
  };

  const handleClear = () => {
    setCronExpression(getDefaultCron(cronType));
    setNextExecutions([]);
    setError('');
  };

  const handleSwap = () => {
    const types: CronType[] = ['linux', 'quartz'];
    const currentIndex = types.indexOf(cronType);
    const nextType = types[(currentIndex + 1) % types.length];
    handleTypeChange(nextType);
  };

  const handleFillNow = () => {
    const now = new Date();
    setStartDate(now.toISOString().split('T')[0]);
    setStartTime(now.toTimeString().substring(0, 5));
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Cron表达式测试</h2>
        <p className="text-muted-foreground text-lg">
          测试Cron表达式并计算下一次执行时间
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Cron表达式
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cronExpression}
                    onChange={(e) => setCronExpression(e.target.value)}
                    placeholder={cronType === 'linux' ? '0 0 * * *' : '0 0 0 * * ?'}
                    className="flex-1 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
                  />
                  <button
                    onClick={handleSwap}
                    className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    title="切换语法类型"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  语法类型
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTypeChange('linux')}
                    className={cn(
                      "px-4 py-2 rounded-xl font-medium transition-all",
                      cronType === 'linux'
                        ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                        : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                    )}
                  >
                    Linux标准
                  </button>
                  <button
                    onClick={() => handleTypeChange('quartz')}
                    className={cn(
                      "px-4 py-2 rounded-xl font-medium transition-all",
                      cronType === 'quartz'
                        ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                        : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                    )}
                  >
                    Quartz扩展
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  起始时间（可选）
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                  />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="flex-1 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                  />
                </div>
                <button
                  onClick={handleFillNow}
                  className="text-sm text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Clock className="w-3 h-3" />
                  使用当前时间
                </button>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={handleTest}
                  className="px-6 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  测试
                </button>
                <button
                  onClick={handleClear}
                  className="px-6 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  重置
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-muted-foreground">
                下5次执行时间
              </label>
              {nextExecutions.length > 0 ? (
                <div className="space-y-3">
                  {nextExecutions.map((exec, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{exec.formatted}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>点击&quot;测试&quot;按钮查看执行时间</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Linux标准（5位）</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 格式：分 时 日 月 周</li>
                <li>• 示例：<code className="text-xs bg-black/5 dark:bg-white/5 px-1 rounded">0 0 * * *</code> 每天零点</li>
                <li>• 示例：<code className="text-xs bg-black/5 dark:bg-white/5 px-1 rounded">*/5 * * * *</code> 每5分钟</li>
                <li>• 示例：<code className="text-xs bg-black/5 dark:bg-white/5 px-1 rounded">0 8 * * 1</code> 每周一8:00</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Quartz扩展（6-7位）</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 格式：秒 分 时 日 月 周 [年]</li>
                <li>• 示例：<code className="text-xs bg-black/5 dark:bg-white/5 px-1 rounded">0 0 0 * * ?</code> 每天零点</li>
                <li>• 示例：<code className="text-xs bg-black/5 dark:bg-white/5 px-1 rounded">0 0/5 * * * ?</code> 每5分钟</li>
                <li>• 示例：<code className="text-xs bg-black/5 dark:bg-white/5 px-1 rounded">0 0 8 ? * 1</code> 每周一8:00</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
