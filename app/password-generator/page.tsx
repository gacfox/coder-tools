'use client';

import { useState } from 'react';
import { Copy, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  // Function to calculate password strength
  const calculatePasswordStrength = () => {
    if (!password) return { strength: '未生成', score: 0, color: '' };

    let score = 0;
    let strength = '';
    let color = '';

    // Length contributes to score (max 40 points for length)
    score += Math.min(40, password.length * 2);

    // Character diversity contributes to score
    let diversityCount = 0;
    if (/[a-z]/.test(password)) diversityCount++;
    if (/[A-Z]/.test(password)) diversityCount++;
    if (/[0-9]/.test(password)) diversityCount++;
    if (/[^a-zA-Z0-9]/.test(password)) diversityCount++;

    score += diversityCount * 15; // Up to 60 points for character diversity

    // Additional bonuses for good practices
    if (password.length >= 8) score += 10;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;

    // Cap the score at 100
    score = Math.min(100, score);

    // Determine strength level
    if (score < 40) {
      strength = '弱';
      color = 'text-red-500';
    } else if (score < 70) {
      strength = '中等';
      color = 'text-yellow-500';
    } else {
      strength = password.length >= 16 ? '很强' : '强';
      color = 'text-green-500';
    }

    return { strength, score, color };
  };

  const generatePassword = () => {
    let charset = '';
    if (includeLowercase) charset += lowercaseChars;
    if (includeUppercase) charset += uppercaseChars;
    if (includeNumbers) charset += numberChars;
    if (includeSymbols) charset += symbolChars;

    if (charset === '') {
      setPassword('请至少选择一种字符类型');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }

    setPassword(newPassword);
    setCopied(false); // Reset copied status when generating new password
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied status after 2 seconds
    }
  };

  const resetGenerator = () => {
    setPassword('');
    setLength(12);
    setIncludeLowercase(true);
    setIncludeUppercase(true);
    setIncludeNumbers(true);
    setIncludeSymbols(true);
    setCopied(false);
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">强随机密码生成器</h2>
        <p className="text-muted-foreground text-lg">
          生成安全的随机密码
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">密码长度: {length}</label>
                  <input
                    type="range"
                    min="4"
                    max="128"
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value))}
                    className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>4</span>
                    <span>128</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground">包含小写字母</label>
                    <input
                      type="checkbox"
                      checked={includeLowercase}
                      onChange={(e) => setIncludeLowercase(e.target.checked)}
                      className="w-5 h-5 rounded border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground">包含大写字母</label>
                    <input
                      type="checkbox"
                      checked={includeUppercase}
                      onChange={(e) => setIncludeUppercase(e.target.checked)}
                      className="w-5 h-5 rounded border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground">包含数字</label>
                    <input
                      type="checkbox"
                      checked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                      className="w-5 h-5 rounded border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground">包含符号</label>
                    <input
                      type="checkbox"
                      checked={includeSymbols}
                      onChange={(e) => setIncludeSymbols(e.target.checked)}
                      className="w-5 h-5 rounded border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={generatePassword}
                    className="px-4 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20 flex-1"
                  >
                    生成密码
                  </button>
                  <button
                    onClick={resetGenerator}
                    className="px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">生成的密码</h3>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-muted-foreground">密码</label>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-sm px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {showPassword ? '隐藏' : '显示'}
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 break-all text-sm font-mono relative">
                    {showPassword ? password : password ? '*'.repeat(password.length) : ''}
                    {password && (
                      <button
                        onClick={copyToClipboard}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
                        title="复制密码"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {copied && (
                    <div className="text-sm text-green-600 dark:text-green-400 text-center animate-pulse">
                      密码已复制到剪贴板！
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">密码强度</h3>
                  <div className="space-y-2">
                    {(() => {
                      const strengthInfo = calculatePasswordStrength();
                      return (
                        <>
                          <div className="flex justify-between text-sm">
                            <span>强度评估</span>
                            <span className={strengthInfo.color}>
                              {strengthInfo.strength}
                            </span>
                          </div>
                          <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2">
                            <div
                              className={
                                password ?
                                  (strengthInfo.score < 40 ? 'bg-red-500' :
                                   strengthInfo.score < 70 ? 'bg-yellow-500' :
                                   'bg-green-500')
                                  : 'bg-blue-500'
                              }
                              style={{
                                width: password ?
                                  `${strengthInfo.score}%`
                                  : '0%',
                                height: '100%'
                              }}
                            ></div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 使用滑块调整密码长度（4-128位）</li>
            <li>• 勾选要包含的字符类型（小写字母、大写字母、数字、符号）</li>
            <li>• 点击"生成密码"按钮生成随机密码</li>
            <li>• 点击"显示/隐藏"按钮查看或隐藏密码</li>
            <li>• 点击密码框右侧的复制按钮将密码复制到剪贴板</li>
          </ul>
        </div>
      </div>
    </>
  );
}