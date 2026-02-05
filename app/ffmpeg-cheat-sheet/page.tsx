"use client";

import { useMemo, useState } from "react";
import { Search, Compass, Sparkles } from "lucide-react";
import FfmpegSection, {
  FfmpegSection as FfmpegSectionType,
} from "./components/FfmpegSection";

const SECTIONS: FfmpegSectionType[] = [
  {
    id: "base",
    title: "基础参数",
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    items: [
      { command: "-codecs", description: "列出可用编码" },
      { command: "-formats", description: "列出支持的格式" },
      { command: "-protocols", description: "列出支持的协议" },
      { command: "-i input.mp4", description: "指定输入文件" },
      { command: "-c:v libx264", description: "指定视频编码" },
      { command: "-c:a aac", description: "指定音频编码" },
      { command: "-vcodec libx264", description: "旧写法（视频编码）" },
      { command: "-acodec aac", description: "旧写法（音频编码）" },
      { command: "-fs SIZE", description: "指定文件大小" },
    ],
  },
  {
    id: "audio",
    title: "音频参数",
    tone: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    items: [
      { command: "-aq QUALITY", description: "音频质量，编码器相关" },
      { command: "-ar 44100", description: "音频采样率" },
      { command: "-ac 1", description: "音频声道数量" },
      { command: "-an", description: "禁止音频" },
      { command: "-vol 512", description: "改变音量为 200%" },
    ],
  },
  {
    id: "video",
    title: "视频参数",
    tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    items: [
      { command: "-aspect RATIO", description: "长宽比 4:3, 16:9" },
      { command: "-r RATE", description: "每秒帧率" },
      { command: "-s WIDTHxHEIGHT", description: "视频尺寸：640x480" },
      { command: "-vn", description: "禁用视频" },
    ],
  },
  {
    id: "bitrate",
    title: "码率设置",
    tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    items: [
      { command: "-b:v 1M", description: "设置视频码率 1mbps/s" },
      { command: "-b:a 1M", description: "设置音频码率 1mbps/s" },
    ],
  },
  {
    id: "transcode",
    title: "视频转码",
    tone: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    items: [
      { command: "ffmpeg -i input.mov output.mp4", description: "转码为 MP4" },
      {
        command: "ffmpeg -i input.mp4 -vn -c:a copy output.aac",
        description: "提取音频",
      },
      {
        command: "ffmpeg -i input.mp4 -vn -c:a mp3 output.mp3",
        description: "提取音频并转码",
      },
      {
        command: "ffmpeg -i input.mov -c:v libx264 -c:a aac -2 out.mp4",
        description: "指定编码参数",
      },
      {
        command: "ffmpeg -i input.mov -c:v libvpx -c:a libvorbis out.webm",
        description: "转换 webm",
      },
      {
        command: "ffmpeg -i input.mp4 -ab 56 -ar 44100 -b 200 -f flv out.flv",
        description: "转换 flv",
      },
      {
        command: "ffmpeg -i input.mp4 -an animated.gif",
        description: "转换 GIF",
      },
    ],
  },
  {
    id: "split",
    title: "切分视频",
    tone: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    items: [
      {
        command: "ffmpeg -i input.mp4 -ss 0 -t 60 first-1-min.mp4",
        description: "切割开头一分钟",
      },
      {
        command: "ffmpeg -i input.mp4 -ss 60 -t 60 second-1-min.mp4",
        description: "一分钟到两分钟",
      },
      {
        command:
          "ffmpeg -i input.mp4 -ss 00:01:23.000 -t 60 first-1-min.mp4",
        description: "另一种时间格式",
      },
    ],
  },
  {
    id: "resize",
    title: "视频尺寸",
    tone: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20",
    items: [
      {
        command: "ffmpeg -i input.mp4 -vf \"scale=640:320\" output.mp4",
        description: "视频尺寸缩放",
      },
      {
        command: "ffmpeg -i input.mp4 -vf \"crop=400:300:10:10\" output.mp4",
        description: "视频尺寸裁剪",
      },
    ],
  },
  {
    id: "misc",
    title: "其他用法",
    tone: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    items: [
      { command: "ffmpeg -i sub.srt sub.ass", description: "字幕格式转换" },
      {
        command: "ffmpeg -i input.mp4 -vf ass=sub.ass out.mp4",
        description: "烧录字幕进视频",
      },
      { command: "ffmpeg -i \"<url>\" out.mp4", description: "下载视频" },
    ],
  },
  {
    id: "recipes",
    title: "组合用法",
    description: "常见组合指令",
    tone: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    items: [
      {
        command:
          "ffmpeg -f lavfi -i anullsrc -i in.gif -c:v libx264 -c:a aac -shortest out.mp4",
        description: "给 gif 加上静音音轨并转换成 mp4",
      },
      {
        command:
          "ffmpeg -f lavfi -i anullsrc -i in.gif -c:v libx264 -c:a aac -shortest -pix_fmt yuv420p -vf \"scale=trunc(iw/2)*2:trunc(ih/2)*2\" out.mp4",
        description: "给 gif 加上静音音轨并转换成 mp4，兼容手机播放",
      },
    ],
  },
];

const QUICK_START = [
  {
    title: "只要音频",
    detail: "从视频中提取音轨",
    command: "ffmpeg -i input.mp4 -vn -c:a copy output.aac",
  },
  {
    title: "转成 MP4",
    detail: "默认 H.264 + AAC",
    command: "ffmpeg -i input.mov -c:v libx264 -c:a aac out.mp4",
  },
  {
    title: "裁剪画面",
    detail: "裁剪到指定宽高",
    command: "ffmpeg -i input.mp4 -vf \"crop=400:300:10:10\" output.mp4",
  },
];

export default function FfmpegCheatSheet() {
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSections = useMemo(() => {
    if (!query.trim()) return SECTIONS;
    const keyword = query.trim().toLowerCase();
    return SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const haystack = `${item.command} ${item.description}`.toLowerCase();
        return haystack.includes(keyword);
      }),
    })).filter((section) => section.items.length > 0);
  }, [query]);

  const totalCount = useMemo(
    () => SECTIONS.reduce((sum, section) => sum + section.items.length, 0),
    []
  );

  const matchedCount = useMemo(
    () =>
      filteredSections.reduce((sum, section) => sum + section.items.length, 0),
    [filteredSections]
  );

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const jumpToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          FFMPEG指令速查表
        </h2>
        <p className="text-muted-foreground text-lg">
          覆盖基础参数、转码、切分、裁剪与常用组合的快速参考
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {QUICK_START.map((item) => (
            <button
              key={item.title}
              onClick={() => handleCopy(item.command, `quick-${item.title}`)}
              className="text-left p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm text-emerald-500">
                <Sparkles className="w-4 h-4" />
                {item.title}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {item.detail}
              </p>
              <p className="text-xs font-mono mt-3 text-foreground">
                {item.command}
              </p>
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索指令、参数、用途..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-black/5 dark:bg-white/5 border-none focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-3 items-center text-sm text-muted-foreground">
            <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5">
              共 {totalCount} 条指令
            </span>
            {query && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                命中 {matchedCount} 条
              </span>
            )}
          </div>
        </div>

        {!query && (
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => jumpToSection(section.id)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center gap-2"
              >
                <Compass className="w-3.5 h-3.5 text-muted-foreground" />
                {section.title}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-10">
          {filteredSections.map((section) => (
            <FfmpegSection
              key={section.id}
              section={section}
              copiedId={copiedId}
              onCopy={handleCopy}
            />
          ))}
        </div>

        {filteredSections.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>未找到匹配的指令</p>
          </div>
        )}
      </div>
    </>
  );
}
