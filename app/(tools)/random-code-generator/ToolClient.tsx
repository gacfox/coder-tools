'use client';

import { useState } from 'react';
import { Copy, Download, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RandomCodeGenerator() {
  const [language, setLanguage] = useState<'java' | 'javascript' | 'python' | 'c'>('javascript');
  const [functionCount, setFunctionCount] = useState(3);
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');

  // Function to generate a random string
  const generateRandomString = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const length = Math.floor(Math.random() * 10) + 5; // Random length between 5-15
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Function to generate a random function name
  const generateRandomFunctionName = () => {
    const prefixes = ['func', 'process', 'handle', 'compute', 'execute', 'run', 'do', 'perform', 'manage', 'operate'];
    const suffixes = ['Task', 'Action', 'Operation', 'Job', 'Work', 'Process', 'Method', 'Routine', 'Procedure', 'Function'];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const number = Math.floor(Math.random() * 1000); // Add a random number
    
    return `${prefix}${suffix}${number}`;
  };

  // Generate code based on selected language
  const generateCode = () => {
    if (functionCount <= 0) {
      setError('函数个数必须大于0');
      return;
    }
    
    if (functionCount > 1000) {
      setError('函数个数不能超过1000个');
      return;
    }

    setError('');
    
    // Generate random function names
    const functionNames = [];
    for (let i = 0; i < functionCount; i++) {
      functionNames.push(generateRandomFunctionName());
    }
    
    // Generate the main function name
    const mainFunctionName = generateRandomFunctionName();
    
    let code = '';
    
    switch (language) {
      case 'java':
        code = generateJavaCode(mainFunctionName, functionNames);
        break;
      case 'javascript':
        code = generateJavaScriptCode(mainFunctionName, functionNames);
        break;
      case 'python':
        code = generatePythonCode(mainFunctionName, functionNames);
        break;
      case 'c':
        code = generateCCode(mainFunctionName, functionNames);
        break;
    }
    
    setGeneratedCode(code);
  };

  // Generate Java code
  const generateJavaCode = (mainFunc: string, funcs: string[]) => {
    let code = `public class RandomCode {\n\n`;
    
    // Generate sub functions
    funcs.forEach(funcName => {
      const randomCount = Math.floor(Math.random() * 5) + 3; // 3-7
      code += `    public static void ${funcName}() {\n`;
      for (let i = 0; i < randomCount; i++) {
        code += `        System.out.println("${generateRandomString()}");\n`;
      }
      code += `    }\n\n`;
    });
    
    // Generate main function
    code += `    public static void ${mainFunc}() {\n`;
    funcs.forEach(funcName => {
      code += `        ${funcName}();\n`;
    });
    code += `    }\n\n`;
    
    // Generate main method
    code += `    public static void main(String[] args) {\n`;
    code += `        ${mainFunc}();\n`;
    code += `    }\n`;
    
    code += `}`;
    
    return code;
  };

  // Generate JavaScript code
  const generateJavaScriptCode = (mainFunc: string, funcs: string[]) => {
    let code = '';
    
    // Generate sub functions
    funcs.forEach(funcName => {
      const randomCount = Math.floor(Math.random() * 5) + 3; // 3-7
      code += `function ${funcName}() {\n`;
      for (let i = 0; i < randomCount; i++) {
        code += `    console.log("${generateRandomString()}");\n`;
      }
      code += `}\n\n`;
    });
    
    // Generate main function
    code += `function ${mainFunc}() {\n`;
    funcs.forEach(funcName => {
      code += `    ${funcName}();\n`;
    });
    code += `}\n\n`;
    
    // Call main function
    code += `${mainFunc}();`;
    
    return code;
  };

  // Generate Python code
  const generatePythonCode = (mainFunc: string, funcs: string[]) => {
    let code = '';
    
    // Generate sub functions
    funcs.forEach(funcName => {
      const randomCount = Math.floor(Math.random() * 5) + 3; // 3-7
      code += `def ${funcName}():\n`;
      for (let i = 0; i < randomCount; i++) {
        code += `    print("${generateRandomString()}")\n`;
      }
      code += `\n`;
    });
    
    // Generate main function
    code += `def ${mainFunc}():\n`;
    funcs.forEach(funcName => {
      code += `    ${funcName}()\n`;
    });
    code += `\n`;
    
    // Call main function
    code += `${mainFunc}()`;
    
    return code;
  };

  // Generate C code
  const generateCCode = (mainFunc: string, funcs: string[]) => {
    let code = `#include <stdio.h>\n\n`;
    
    // Generate function declarations
    funcs.forEach(funcName => {
      code += `void ${funcName}();\n`;
    });
    code += `void ${mainFunc}();\n\n`;
    
    // Generate sub functions
    funcs.forEach(funcName => {
      const randomCount = Math.floor(Math.random() * 5) + 3; // 3-7
      code += `void ${funcName}() {\n`;
      for (let i = 0; i < randomCount; i++) {
        code += `    printf("${generateRandomString()}\\n");\n`;
      }
      code += `}\n\n`;
    });
    
    // Generate main function
    code += `void ${mainFunc}() {\n`;
    funcs.forEach(funcName => {
      code += `    ${funcName}();\n`;
    });
    code += `}\n\n`;
    
    // Generate main function
    code += `int main() {\n`;
    code += `    ${mainFunc}();\n`;
    code += `    return 0;\n`;
    code += `}`;
    
    return code;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  const downloadCode = () => {
    let extension = '';
    switch (language) {
      case 'java': extension = '.java'; break;
      case 'javascript': extension = '.js'; break;
      case 'python': extension = '.py'; break;
      case 'c': extension = '.c'; break;
    }
    
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `random_code${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">随机代码生成器</h2>
        <p className="text-muted-foreground text-lg">
          生成包含随机函数的代码
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">编程语言</label>
                <div className="flex gap-2 flex-wrap">
                  {(['java', 'javascript', 'python', 'c'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={cn(
                        "px-4 py-2 rounded-xl font-medium transition-all",
                        language === lang
                          ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                          : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                      )}
                    >
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  函数量: {functionCount}
                </label>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={functionCount}
                  onChange={(e) => setFunctionCount(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>1000</span>
                </div>
              </div>

              <button
                onClick={generateCode}
                className="w-full py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <Code className="w-5 h-5" />
                生成代码
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">生成的代码</label>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    disabled={!generatedCode}
                    className={cn(
                      "text-xs px-2 py-1 rounded-lg transition-colors flex items-center gap-1",
                      generatedCode
                        ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                        : "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Copy className="w-3 h-3" />
                    复制
                  </button>
                  <button
                    onClick={downloadCode}
                    disabled={!generatedCode}
                    className={cn(
                      "text-xs px-2 py-1 rounded-lg transition-colors flex items-center gap-1",
                      generatedCode
                        ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                        : "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Download className="w-3 h-3" />
                    下载
                  </button>
                </div>
              </div>
              <div className="h-96 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-mono text-sm overflow-auto">
                {generatedCode ? (
                  <pre className="whitespace-pre-wrap break-words">{generatedCode}</pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    {error || '点击"生成代码"按钮生成随机代码'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 选择编程语言（Java、JavaScript、Python 或 C）</li>
            <li>• 使用滑块选择要生成的函数个数（1-1000）</li>
            <li>• 点击"生成代码"按钮生成随机代码</li>
            <li>• 生成的代码包含一个主函数和指定数量的子函数</li>
            <li>• 子函数会随机打印3-7次随机字符串</li>
            <li>• 可以复制或下载生成的代码</li>
          </ul>
        </div>
      </div>
    </>
  );
}