'use client';

import { useState, useRef } from 'react';
import { Upload, Hash, Download, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import crypto-browserify for client-side hashing
import CryptoJS from 'crypto-js';

export default function HashCalculator() {
  const [inputText, setInputText] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [hashResult, setHashResult] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('SHA256');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text'); // 'text' or 'file'
  const fileInputRef = useRef<HTMLInputElement>(null);

  const algorithms = [
    'MD5',
    'SHA1',
    'SHA224',
    'SHA256',
    'SHA384',
    'SHA512',
    'SHA3',
    'RIPEMD160'
  ];

  const calculateHash = () => {
    if (inputMode === 'text' && !inputText) {
      setError('请输入文本');
      return;
    }

    if (inputMode === 'file' && !fileName) {
      setError('请上传文件');
      return;
    }

    setError('');

    try {
      let hashValue = '';
      const dataToHash = inputMode === 'text' ? inputText : fileContent;

      switch (selectedAlgorithm) {
        case 'MD5':
          hashValue = CryptoJS.MD5(dataToHash).toString();
          break;
        case 'SHA1':
          hashValue = CryptoJS.SHA1(dataToHash).toString();
          break;
        case 'SHA224':
          hashValue = CryptoJS.SHA224(dataToHash).toString();
          break;
        case 'SHA256':
          hashValue = CryptoJS.SHA256(dataToHash).toString();
          break;
        case 'SHA384':
          hashValue = CryptoJS.SHA384(dataToHash).toString();
          break;
        case 'SHA512':
          hashValue = CryptoJS.SHA512(dataToHash).toString();
          break;
        case 'SHA3':
          hashValue = CryptoJS.SHA3(dataToHash).toString();
          break;
        case 'RIPEMD160':
          hashValue = CryptoJS.RIPEMD160(dataToHash).toString();
          break;
        default:
          throw new Error('不支持的算法');
      }

      setHashResult(hashValue);
    } catch (err) {
      setError('计算哈希值时出错');
      console.error(err);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content || '');
      setHashResult(''); // Reset previous result
    };

    reader.onerror = () => {
      setError('文件读取失败');
    };

    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hashResult);
  };

  const resetCalculator = () => {
    setInputText('');
    setFileContent('');
    setHashResult('');
    setFileName('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">HASH计算工具</h2>
        <p className="text-muted-foreground text-lg">
          计算文本或文件的哈希值
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setInputMode('text')}
                    className={`px-4 py-2 rounded-xl font-medium flex-1 ${
                      inputMode === 'text'
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                        : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                    }`}
                  >
                    文本输入
                  </button>
                  <button
                    onClick={() => setInputMode('file')}
                    className={`px-4 py-2 rounded-xl font-medium flex-1 ${
                      inputMode === 'file'
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                        : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                    }`}
                  >
                    文件上传
                  </button>
                </div>

                {inputMode === 'file' ? (
                  <div>
                    <div
                      className="border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl p-8 text-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      onClick={triggerFileInput}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Upload className="w-10 h-10 text-muted-foreground" />
                        <div>
                          <p className="font-medium">点击上传文件</p>
                          <p className="text-sm text-muted-foreground">支持文本文件</p>
                        </div>
                      </div>
                    </div>

                    {fileName && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        已选择文件: {fileName}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">输入文本</label>
                    <textarea
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value);
                        setHashResult(''); // Reset result when text changes
                      }}
                      placeholder="在此输入要计算哈希值的文本..."
                      className="w-full p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 min-h-[200px]"
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {inputMode === 'file' && (
                    <button
                      onClick={triggerFileInput}
                      className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      选择文件
                    </button>
                  )}
                  <button
                    onClick={resetCalculator}
                    className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    重置
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">HASH算法</h3>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">选择算法</label>
                  <select
                    value={selectedAlgorithm}
                    onChange={(e) => {
                      setSelectedAlgorithm(e.target.value);
                      setHashResult(''); // Reset result when algorithm changes
                    }}
                    className="w-full p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                  >
                    {algorithms.map((algorithm) => (
                      <option key={algorithm} value={algorithm}>
                        {algorithm}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={calculateHash}
                  disabled={inputMode === 'text' ? !inputText : !fileName}
                  className={cn(
                    "w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2",
                    (inputMode === 'text' ? inputText : fileName)
                      ? "bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Hash className="w-4 h-4" />
                  计算HASH
                </button>

                {hashResult && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-muted-foreground">计算结果</label>
                      <button
                        onClick={copyToClipboard}
                        className="text-sm px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                      >
                        复制
                      </button>
                    </div>
                    <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 break-all text-sm font-mono">
                      {hashResult}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">算法说明</h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>MD5:</strong> 128位哈希值，由于安全性问题，不推荐用于安全相关场景</p>
                  <p><strong>SHA1:</strong> 160位哈希值，由于碰撞攻击，不推荐用于安全相关场景</p>
                  <p><strong>SHA256/SHA512:</strong> SHA-2系列算法，安全性较高，广泛用于安全场景</p>
                  <p><strong>SHA3:</strong> 最新的SHA系列算法，基于Keccak算法</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 使用上方的切换按钮选择"文本输入"或"文件上传"模式</li>
            <li>• 在文本模式下，直接在文本框中输入要计算哈希值的内容</li>
            <li>• 在文件模式下，点击上传文件按钮选择要计算哈希值的文件</li>
            <li>• 从下拉菜单中选择要使用的哈希算法</li>
            <li>• 点击"计算HASH"按钮获取结果</li>
            <li>• 计算结果会显示在右侧，可以点击"复制"按钮复制结果</li>
          </ul>
        </div>
      </div>
    </>
  );
}