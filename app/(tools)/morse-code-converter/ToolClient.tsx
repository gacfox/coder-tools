"use client";

import { useMemo, useRef, useState } from "react";
import { Copy, RotateCcw, Download, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const MORSE_MAP: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "/": "-..-.",
  "-": "-....-",
  "(": "-.--.",
  ")": "-.--.-",
  "@": ".--.-.",
  ":": "---...",
  "'": ".----.",
  "!": "-.-.--",
  "=": "-...-",
  "+": ".-.-.",
  "&": ".-...",
};

const REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([key, value]) => [value, key])
);

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

type Segment = { tone: boolean; durationSec: number };

const buildSegments = (morse: string, unitMs: number): Segment[] => {
  const tokens = morse
    .trim()
    .replace(/\|/g, "/")
    .split(/\s+/)
    .filter(Boolean);
  if (tokens.length === 0) return [];

  const unitSec = unitMs / 1000;
  const segments: Segment[] = [];

  tokens.forEach((token, index) => {
    if (token === "/") {
      segments.push({ tone: false, durationSec: 7 * unitSec });
      return;
    }

    const chars = token.split("");
    chars.forEach((symbol, i) => {
      if (symbol === ".") {
        segments.push({ tone: true, durationSec: 1 * unitSec });
      } else if (symbol === "-") {
        segments.push({ tone: true, durationSec: 3 * unitSec });
      }
      if (i < chars.length - 1) {
        segments.push({ tone: false, durationSec: 1 * unitSec });
      }
    });

    const nextToken = tokens[index + 1];
    if (nextToken && nextToken !== "/") {
      segments.push({ tone: false, durationSec: 3 * unitSec });
    }
  });

  return segments;
};

const encodeWav = (samples: Float32Array, sampleRate: number) => {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  let offset = 0;

  const writeString = (value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset, value.charCodeAt(i));
      offset += 1;
    }
  };

  const writeUint16 = (value: number) => {
    view.setUint16(offset, value, true);
    offset += 2;
  };

  const writeUint32 = (value: number) => {
    view.setUint32(offset, value, true);
    offset += 4;
  };

  writeString("RIFF");
  writeUint32(36 + samples.length * 2);
  writeString("WAVE");
  writeString("fmt ");
  writeUint32(16);
  writeUint16(1);
  writeUint16(1);
  writeUint32(sampleRate);
  writeUint32(sampleRate * 2);
  writeUint16(2);
  writeUint16(16);
  writeString("data");
  writeUint32(samples.length * 2);

  for (let i = 0; i < samples.length; i += 1) {
    const s = clamp(samples[i], -1, 1);
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return buffer;
};

export default function MorseCodeConverter() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"encode" | "decode">("encode");
  const [unitMs, setUnitMs] = useState(120);
  const [frequency, setFrequency] = useState(700);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleEncode = () => {
    const tokens: string[] = [];
    const unknownChars: string[] = [];

    for (const rawChar of inputText) {
      if (/\s/.test(rawChar)) {
        if (tokens[tokens.length - 1] !== "/") {
          tokens.push("/");
        }
        continue;
      }

      const char = rawChar.toUpperCase();
      const morse = MORSE_MAP[char];
      if (morse) {
        tokens.push(morse);
      } else {
        unknownChars.push(rawChar);
      }
    }

    const result = tokens.join(" ");
    setOutputText(result);
    if (unknownChars.length > 0) {
      setError(`无法识别字符：${[...new Set(unknownChars)].join(" ")}`);
    } else {
      setError("");
    }
  };

  const handleDecode = () => {
    const normalized = inputText.trim().replace(/\|/g, "/");
    if (!normalized) {
      setOutputText("");
      setError("");
      return;
    }

    const tokens = normalized.split(/\s+/);
    const unknownTokens: string[] = [];
    const chars: string[] = [];

    tokens.forEach((token) => {
      if (token === "/") {
        chars.push(" ");
        return;
      }
      const char = REVERSE_MAP[token];
      if (char) {
        chars.push(char);
      } else {
        unknownTokens.push(token);
        chars.push("�");
      }
    });

    setOutputText(chars.join(""));
    if (unknownTokens.length > 0) {
      setError(`无法识别摩斯码：${[...new Set(unknownTokens)].join(" ")}`);
    } else {
      setError("");
    }
  };

  const handleConvert = () => {
    if (activeTab === "encode") {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const handleSwap = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setError("");
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setError("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const playMorse = async () => {
    const morse =
      activeTab === "encode" ? outputText.trim() : inputText.trim();

    if (!morse) {
      setError("没有可播放的摩斯电码");
      return;
    }

    const segments = buildSegments(morse, unitMs);
    if (segments.length === 0) {
      setError("摩斯电码格式无效");
      return;
    }

    setError("");

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;
    await audioContext.resume();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.value = 0;
    oscillator.connect(gain).connect(audioContext.destination);

    let currentTime = audioContext.currentTime + 0.05;
    segments.forEach((segment) => {
      gain.gain.setValueAtTime(segment.tone ? 0.3 : 0, currentTime);
      currentTime += segment.durationSec;
    });

    oscillator.start();
    oscillator.stop(currentTime + 0.05);
  };

  const exportWav = () => {
    const morse =
      activeTab === "encode" ? outputText.trim() : inputText.trim();
    if (!morse) {
      setError("没有可导出的摩斯电码");
      return;
    }

    const segments = buildSegments(morse, unitMs);
    if (segments.length === 0) {
      setError("摩斯电码格式无效");
      return;
    }

    const sampleRate = 44100;
    const totalSamples = Math.ceil(
      segments.reduce((sum, seg) => sum + seg.durationSec, 0) * sampleRate
    );
    const samples = new Float32Array(totalSamples);

    let index = 0;
    const rampSamples = Math.floor(sampleRate * 0.005);

    segments.forEach((segment) => {
      const segSamples = Math.floor(segment.durationSec * sampleRate);
      if (segment.tone) {
        for (let i = 0; i < segSamples; i += 1) {
          const time = (index + i) / sampleRate;
          let amp = Math.sin(2 * Math.PI * frequency * time) * 0.4;
          const ramp = Math.min(rampSamples, Math.floor(segSamples / 2));
          if (ramp > 0) {
            if (i < ramp) amp *= i / ramp;
            if (i > segSamples - ramp) amp *= (segSamples - i) / ramp;
          }
          samples[index + i] = amp;
        }
      }
      index += segSamples;
    });

    const wavBuffer = encodeWav(samples, sampleRate);
    const blob = new Blob([wavBuffer], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "morse-code.wav";
    link.click();
    URL.revokeObjectURL(url);
  };

  const morsePreview = useMemo(() => {
    if (activeTab === "encode") return outputText;
    return inputText.trim();
  }, [activeTab, inputText, outputText]);

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">摩斯电码转换器</h2>
        <p className="text-muted-foreground text-lg">
          文本与摩斯电码之间的双向转换与播放
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("encode")}
            className={cn(
              "px-4 py-2 rounded-xl font-medium transition-all",
              activeTab === "encode"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            文本转摩斯
          </button>
          <button
            onClick={() => setActiveTab("decode")}
            className={cn(
              "px-4 py-2 rounded-xl font-medium transition-all",
              activeTab === "decode"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            摩斯转文本
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                {activeTab === "encode" ? "输入文本" : "输入摩斯电码"}
              </label>
              <button
                onClick={() => copyToClipboard(inputText)}
                className="text-xs px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <Copy className="w-3 h-3 inline mr-1" />
                复制
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeTab === "encode"
                  ? "请输入要转换的文本..."
                  : "请输入摩斯电码（. - / 用空格分隔）..."
              }
              className="w-full h-48 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                {activeTab === "encode" ? "输出摩斯电码" : "输出文本"}
              </label>
              <button
                onClick={() => copyToClipboard(outputText)}
                disabled={!outputText}
                className={cn(
                  "text-xs px-2 py-1 rounded-lg transition-colors",
                  outputText
                    ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                    : "opacity-50 cursor-not-allowed"
                )}
              >
                <Copy className="w-3 h-3 inline mr-1" />
                复制
              </button>
            </div>
            <textarea
              value={outputText}
              readOnly
              placeholder={
                activeTab === "encode"
                  ? "转换后的摩斯电码将显示在这里..."
                  : "解码后的文本将显示在这里..."
              }
              className="w-full h-48 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={handleConvert}
            className="px-6 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20"
          >
            {activeTab === "encode" ? "转换为摩斯电码" : "解码"}
          </button>
          <button
            onClick={handleSwap}
            disabled={!outputText}
            className={cn(
              "px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2",
              outputText
                ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                : "opacity-50 cursor-not-allowed"
            )}
          >
            <RotateCcw className="w-4 h-4" />
            交换内容
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            清空
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              单位时长 (ms)
            </label>
            <input
              type="number"
              min="40"
              max="300"
              value={unitMs}
              onChange={(e) => setUnitMs(Number(e.target.value) || 120)}
              className="w-full p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              频率 (Hz)
            </label>
            <input
              type="number"
              min="300"
              max="1200"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value) || 700)}
              className="w-full p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
            />
          </div>
          <div className="flex flex-col justify-end gap-3">
            <button
              onClick={playMorse}
              disabled={!morsePreview}
              className={cn(
                "w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2",
                morsePreview
                  ? "bg-green-500 text-white hover:bg-green-600 transition-colors shadow-md shadow-green-500/20"
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              <Play className="w-4 h-4" />
              播放摩斯
            </button>
            <button
              onClick={exportWav}
              disabled={!morsePreview}
              className={cn(
                "w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2",
                morsePreview
                  ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              <Download className="w-4 h-4" />
              导出 WAV
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 文本转摩斯：支持字母、数字与常用标点</li>
            <li>• 摩斯转文本：使用空格分隔字母，使用“/”分隔单词</li>
            <li>• 播放与导出将基于当前摩斯电码与音频参数</li>
          </ul>
        </div>
      </div>
    </>
  );
}
