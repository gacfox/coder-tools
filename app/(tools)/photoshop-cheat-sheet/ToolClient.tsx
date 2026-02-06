"use client";

import { useMemo, useState } from "react";
import { Search, Compass, Palette } from "lucide-react";
import PhotoshopSection, {
  PhotoshopSection as PhotoshopSectionType,
} from "./components/PhotoshopSection";

const SECTIONS: PhotoshopSectionType[] = [
  {
    id: "tools",
    title: "工具箱",
    description: "多工具共享快捷键时可用 Shift 切换",
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    items: [
      { action: "矩形、椭圆选框工具", shortcut: "M" },
      { action: "裁剪工具", shortcut: "C" },
      { action: "移动工具", shortcut: "V" },
      { action: "套索、多边形套索、磁性套索", shortcut: "L" },
      { action: "魔棒工具", shortcut: "W" },
      { action: "喷枪工具", shortcut: "J" },
      { action: "画笔工具", shortcut: "B" },
      { action: "像皮图章、图案图章", shortcut: "S" },
      { action: "历史记录画笔工具", shortcut: "Y" },
      { action: "像皮擦工具", shortcut: "E" },
      { action: "铅笔、直线工具", shortcut: "N" },
      { action: "模糊、锐化、涂抹工具", shortcut: "R" },
      { action: "减淡、加深、海棉工具", shortcut: "O" },
      { action: "钢笔、自由钢笔、磁性钢笔", shortcut: "P" },
      { action: "添加锚点工具", shortcut: "+" },
      { action: "删除锚点工具", shortcut: "-" },
      { action: "直接选取工具", shortcut: "A" },
      { action: "文字/直排/文字蒙版工具", shortcut: "T" },
      { action: "度量工具", shortcut: "U" },
      { action: "渐变工具", shortcut: "G" },
      { action: "油漆桶工具", shortcut: "K" },
      { action: "吸管、颜色取样器", shortcut: "I" },
      { action: "抓手工具", shortcut: "H" },
      { action: "缩放工具", shortcut: "Z" },
      { action: "默认前景色和背景色", shortcut: "D" },
      { action: "切换前景色和背景色", shortcut: "X" },
      { action: "切换标准模式和快速蒙板模式", shortcut: "Q" },
      { action: "标准/全屏模式切换", shortcut: "F" },
      { action: "临时使用移动工具", shortcut: "Ctrl" },
      { action: "临时使用吸色工具", shortcut: "Alt" },
      { action: "临时使用抓手工具", shortcut: "空格" },
      { action: "打开工具选项面板", shortcut: "Enter" },
      { action: "快速输入工具选项（0-9）", shortcut: "0 至 9" },
      { action: "循环选择画笔", shortcut: "[ 或 ]" },
      { action: "选择第一个画笔", shortcut: "Shift + [" },
      { action: "选择最后一个画笔", shortcut: "Shift + ]" },
      { action: "建立新渐变（渐变编辑器）", shortcut: "Ctrl + N" },
    ],
  },
  {
    id: "file",
    title: "文件操作",
    tone: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    items: [
      { action: "新建图形文件", shortcut: "Ctrl + N" },
      { action: "默认设置新建", shortcut: "Ctrl + Alt + N" },
      { action: "打开已有图像", shortcut: "Ctrl + O" },
      { action: "打开为...", shortcut: "Ctrl + Alt + O" },
      { action: "关闭当前图像", shortcut: "Ctrl + W" },
      { action: "保存当前图像", shortcut: "Ctrl + S" },
      { action: "另存为...", shortcut: "Ctrl + Shift + S" },
      { action: "存储副本", shortcut: "Ctrl + Alt + S" },
      { action: "存储为 Web 格式", shortcut: "Ctrl + Shift + Alt + S" },
      { action: "页面设置", shortcut: "Ctrl + Shift + P" },
      { action: "打印", shortcut: "Ctrl + P" },
      { action: "打开预置对话框", shortcut: "Ctrl + K" },
      { action: "显示最后一次预置对话框", shortcut: "Alt + Ctrl + K" },
      { action: "预置：常规", shortcut: "Ctrl + 1" },
      { action: "预置：存储文件", shortcut: "Ctrl + 2" },
      { action: "预置：显示和光标", shortcut: "Ctrl + 3" },
      { action: "预置：透明区域与色域", shortcut: "Ctrl + 4" },
      { action: "预置：单位与标尺", shortcut: "Ctrl + 5" },
      { action: "预置：参考线与网格", shortcut: "Ctrl + 6" },
      { action: "外发光效果（效果对话框）", shortcut: "Ctrl + 3" },
      { action: "内发光效果（效果对话框）", shortcut: "Ctrl + 4" },
      { action: "斜面和浮雕（效果对话框）", shortcut: "Ctrl + 5" },
      { action: "应用当前所选效果", shortcut: "A" },
    ],
  },
  {
    id: "blend",
    title: "图层混合模式",
    tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    items: [
      { action: "循环选择混合模式", shortcut: "Shift + - 或 +" },
      { action: "正常", shortcut: "Ctrl + Alt + N" },
      { action: "阈值（位图模式）", shortcut: "Ctrl + Alt + L" },
      { action: "溶解", shortcut: "Ctrl + Alt + I" },
      { action: "背后", shortcut: "Ctrl + Alt + Q" },
      { action: "清除", shortcut: "Ctrl + Alt + R" },
      { action: "正片叠底", shortcut: "Ctrl + Alt + M" },
      { action: "屏幕", shortcut: "Ctrl + Alt + S" },
      { action: "叠加", shortcut: "Ctrl + Alt + O" },
      { action: "柔光", shortcut: "Ctrl + Alt + F" },
      { action: "强光", shortcut: "Ctrl + Alt + H" },
      { action: "颜色减淡", shortcut: "Ctrl + Alt + D" },
      { action: "颜色加深", shortcut: "Ctrl + Alt + B" },
      { action: "变暗", shortcut: "Ctrl + Alt + K" },
      { action: "变亮", shortcut: "Ctrl + Alt + G" },
      { action: "差值", shortcut: "Ctrl + Alt + E" },
      { action: "排除", shortcut: "Ctrl + Alt + X" },
      { action: "色相", shortcut: "Ctrl + Alt + U" },
      { action: "饱和度", shortcut: "Ctrl + Alt + T" },
      { action: "颜色", shortcut: "Ctrl + Alt + C" },
      { action: "光度", shortcut: "Ctrl + Alt + Y" },
      { action: "去色（海棉工具）", shortcut: "Ctrl + Alt + J" },
      { action: "加色（海棉工具）", shortcut: "Ctrl + Alt + A" },
      { action: "暗调（减淡/加深工具）", shortcut: "Ctrl + Alt + W" },
      { action: "中间调（减淡/加深工具）", shortcut: "Ctrl + Alt + V" },
      { action: "高光（减淡/加深工具）", shortcut: "Ctrl + Alt + Z" },
    ],
  },
  {
    id: "selection",
    title: "选择功能",
    tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    items: [
      { action: "全部选取", shortcut: "Ctrl + A" },
      { action: "取消选择", shortcut: "Ctrl + D" },
      { action: "重新选择", shortcut: "Ctrl + Shift + D" },
      { action: "羽化选择", shortcut: "Ctrl + Alt + D" },
      { action: "反向选择", shortcut: "Ctrl + Shift + I" },
      { action: "路径变选区", shortcut: "数字键盘 Enter" },
      {
        action: "载入选区（图层/路径/通道缩略图）",
        shortcut: "Ctrl + 单击缩略图",
      },
    ],
  },
  {
    id: "filters",
    title: "滤镜",
    tone: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    items: [
      { action: "按上次参数再做一次滤镜", shortcut: "Ctrl + F" },
      { action: "退去上次滤镜效果", shortcut: "Ctrl + Shift + F" },
      { action: "重复上次滤镜（可调参数）", shortcut: "Ctrl + Alt + F" },
      { action: "选择工具（3D 变化滤镜）", shortcut: "V" },
      { action: "立方体工具（3D 变化滤镜）", shortcut: "M" },
      { action: "球体工具（3D 变化滤镜）", shortcut: "N" },
      { action: "柱体工具（3D 变化滤镜）", shortcut: "C" },
      { action: "轨迹球（3D 变化滤镜）", shortcut: "R" },
      { action: "全景相机工具（3D 变化滤镜）", shortcut: "E" },
    ],
  },
  {
    id: "view",
    title: "视图操作",
    tone: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    items: [
      { action: "显示彩色通道", shortcut: "Ctrl + ~" },
      { action: "显示单色通道", shortcut: "Ctrl + 数字" },
      { action: "显示复合通道", shortcut: "~" },
      { action: "CMYK 预览（开关）", shortcut: "Ctrl + Y" },
      { action: "色域警告（开关）", shortcut: "Ctrl + Shift + Y" },
      { action: "放大视图", shortcut: "Ctrl + +" },
      { action: "缩小视图", shortcut: "Ctrl + -" },
      { action: "满画布显示", shortcut: "Ctrl + 0" },
      { action: "实际像素显示", shortcut: "Ctrl + Alt + 0" },
      { action: "向上卷动一屏", shortcut: "PageUp" },
      { action: "向下卷动一屏", shortcut: "PageDown" },
      { action: "向左卷动一屏", shortcut: "Ctrl + PageUp" },
      { action: "向右卷动一屏", shortcut: "Ctrl + PageDown" },
      { action: "向上卷动 10 单位", shortcut: "Shift + PageUp" },
      { action: "向下卷动 10 单位", shortcut: "Shift + PageDown" },
      { action: "向左卷动 10 单位", shortcut: "Shift + Ctrl + PageUp" },
      { action: "向右卷动 10 单位", shortcut: "Shift + Ctrl + PageDown" },
      { action: "视图移到左上角", shortcut: "Home" },
      { action: "视图移到右下角", shortcut: "End" },
      { action: "显示/隐藏选择区域", shortcut: "Ctrl + H" },
      { action: "显示/隐藏路径", shortcut: "Ctrl + Shift + H" },
      { action: "显示/隐藏标尺", shortcut: "Ctrl + R" },
      { action: "显示/隐藏参考线", shortcut: "Ctrl + ;" },
      { action: "显示/隐藏网格", shortcut: "Ctrl + \"" },
      { action: "贴紧参考线", shortcut: "Ctrl + Shift + ;" },
      { action: "锁定参考线", shortcut: "Ctrl + Alt + ;" },
      { action: "贴紧网格", shortcut: "Ctrl + Shift + \"" },
      { action: "显示/隐藏画笔面板", shortcut: "F5" },
      { action: "显示/隐藏颜色面板", shortcut: "F6" },
      { action: "显示/隐藏图层面板", shortcut: "F7" },
      { action: "显示/隐藏信息面板", shortcut: "F8" },
      { action: "显示/隐藏动作面板", shortcut: "F9" },
      { action: "显示/隐藏所有面板", shortcut: "Tab" },
      { action: "隐藏工具箱以外面板", shortcut: "Shift + Tab" },
    ],
  },
  {
    id: "type",
    title: "文字处理",
    description: "文字工具对话框中可用",
    tone: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    items: [
      { action: "左对齐或顶对齐", shortcut: "Ctrl + Shift + L" },
      { action: "中对齐", shortcut: "Ctrl + Shift + C" },
      { action: "右对齐或底对齐", shortcut: "Ctrl + Shift + R" },
      { action: "左右选择 1 个字符", shortcut: "Shift + ← / →" },
      { action: "上下选择 1 行", shortcut: "Shift + ↑ / ↓" },
      { action: "选择所有字符", shortcut: "Ctrl + A" },
      { action: "选择从插入点到点击位置", shortcut: "Shift + 点按" },
      { action: "左右移动 1 个字符", shortcut: "← / →" },
      { action: "上下移动 1 行", shortcut: "↑ / ↓" },
      { action: "左右移动 1 个字", shortcut: "Ctrl + ← / →" },
      { action: "文字大小减小 2pt", shortcut: "Ctrl + Shift + <" },
      { action: "文字大小增大 2pt", shortcut: "Ctrl + Shift + >" },
      { action: "文字大小减小 10pt", shortcut: "Ctrl + Alt + Shift + <" },
      { action: "文字大小增大 10pt", shortcut: "Ctrl + Alt + Shift + >" },
      { action: "行距减小 2pt", shortcut: "Alt + ↓" },
      { action: "行距增大 2pt", shortcut: "Alt + ↑" },
      { action: "基线位移减小 2pt", shortcut: "Shift + Alt + ↓" },
      { action: "基线位移增大 2pt", shortcut: "Shift + Alt + ↑" },
      { action: "字距减小 20/1000ems", shortcut: "Alt + ←" },
      { action: "字距增加 20/1000ems", shortcut: "Alt + →" },
      { action: "字距减小 100/1000ems", shortcut: "Ctrl + Alt + ←" },
      { action: "字距增加 100/1000ems", shortcut: "Ctrl + Alt + →" },
      { action: "预置：增效工具与暂存盘", shortcut: "Ctrl + 7" },
      { action: "预置：内存与图像高速缓存", shortcut: "Ctrl + 8" },
    ],
  },
  {
    id: "edit",
    title: "编辑操作",
    tone: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20",
    items: [
      { action: "还原/重做前一步", shortcut: "Ctrl + Z" },
      { action: "还原两步以上", shortcut: "Ctrl + Alt + Z" },
      { action: "重做两步以上", shortcut: "Ctrl + Shift + Z" },
      { action: "剪切选取图像或路径", shortcut: "Ctrl + X / F2" },
      { action: "拷贝选取图像或路径", shortcut: "Ctrl + C" },
      { action: "合并拷贝", shortcut: "Ctrl + Shift + C" },
      { action: "粘贴到当前图形", shortcut: "Ctrl + V / F4" },
      { action: "粘贴到选框中", shortcut: "Ctrl + Shift + V" },
      { action: "自由变换", shortcut: "Ctrl + T" },
      { action: "应用自由变换", shortcut: "Enter" },
      { action: "从中心开始变换", shortcut: "Alt" },
      { action: "限制变换比例", shortcut: "Shift" },
      { action: "扭曲变换", shortcut: "Ctrl" },
      { action: "取消变形", shortcut: "Esc" },
      { action: "自由变换复制像素", shortcut: "Ctrl + Shift + T" },
      { action: "重复变换并建立副本", shortcut: "Ctrl + Shift + Alt + T" },
      { action: "删除选框图案或路径", shortcut: "Del" },
      { action: "背景色填充", shortcut: "Ctrl + Backspace / Ctrl + Del" },
      { action: "前景色填充", shortcut: "Alt + Backspace / Alt + Del" },
      { action: "弹出填充对话框", shortcut: "Shift + Backspace" },
      { action: "从历史记录中填充", shortcut: "Alt + Ctrl + Backspace" },
    ],
  },
  {
    id: "adjust",
    title: "图像调整",
    tone: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    items: [
      { action: "调整色阶", shortcut: "Ctrl + L" },
      { action: "自动调整色阶", shortcut: "Ctrl + Shift + L" },
      { action: "曲线调整对话框", shortcut: "Ctrl + M" },
      {
        action: "曲线中添加新点",
        shortcut: "Ctrl + 点按",
      },
      {
        action: "复合曲线以外添加新点",
        shortcut: "Ctrl + Shift + 点按",
      },
      { action: "移动所选点", shortcut: "↑ / ↓ / ← / →" },
      { action: "以 10 点为增幅移动", shortcut: "Shift + 箭头" },
      { action: "选择多个控制点", shortcut: "Shift + 点按" },
      { action: "前移控制点", shortcut: "Ctrl + Tab" },
      { action: "后移控制点", shortcut: "Ctrl + Shift + Tab" },
      { action: "添加新点（曲线网格）", shortcut: "点按网格" },
      { action: "删除点（曲线网格）", shortcut: "Ctrl + 点按点" },
      { action: "取消选择所有点", shortcut: "Ctrl + D" },
      { action: "曲线网格更细/更粗", shortcut: "Alt + 点按网格" },
      { action: "选择彩色通道", shortcut: "Ctrl + ~" },
      { action: "选择单色通道", shortcut: "Ctrl + 数字" },
      { action: "色彩平衡对话框", shortcut: "Ctrl + B" },
      { action: "色相/饱和度对话框", shortcut: "Ctrl + U" },
      { action: "全图调整（色相/饱和度）", shortcut: "Ctrl + ~" },
      { action: "只调整红色", shortcut: "Ctrl + 1" },
      { action: "只调整黄色", shortcut: "Ctrl + 2" },
      { action: "只调整绿色", shortcut: "Ctrl + 3" },
      { action: "只调整青色", shortcut: "Ctrl + 4" },
      { action: "只调整蓝色", shortcut: "Ctrl + 5" },
      { action: "只调整洋红", shortcut: "Ctrl + 6" },
      { action: "去色", shortcut: "Ctrl + Shift + U" },
      { action: "反相", shortcut: "Ctrl + Shift + I" },
    ],
  },
  {
    id: "layers",
    title: "图层操作",
    tone: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    items: [
      { action: "新建图层", shortcut: "Ctrl + Shift + N" },
      { action: "默认选项新建图层", shortcut: "Ctrl + Alt + Shift + N" },
      { action: "通过拷贝建立图层", shortcut: "Ctrl + J" },
      { action: "通过剪切建立图层", shortcut: "Ctrl + Shift + J" },
      { action: "与前一图层编组", shortcut: "Ctrl + G" },
      { action: "取消编组", shortcut: "Ctrl + Shift + G" },
      { action: "向下合并/合并联接", shortcut: "Ctrl + E" },
      { action: "合并可见图层", shortcut: "Ctrl + Shift + E" },
      { action: "盖印或盖印联接图层", shortcut: "Ctrl + Alt + E" },
      { action: "盖印可见图层", shortcut: "Ctrl + Alt + Shift + E" },
      { action: "当前层下移一层", shortcut: "Ctrl + [" },
      { action: "当前层上移一层", shortcut: "Ctrl + ]" },
      { action: "当前层移到最下面", shortcut: "Ctrl + Shift + [" },
      { action: "当前层移到最上面", shortcut: "Ctrl + Shift + ]" },
      { action: "激活下一个图层", shortcut: "Alt + [" },
      { action: "激活上一个图层", shortcut: "Alt + ]" },
      { action: "激活底部图层", shortcut: "Shift + Alt + [" },
      { action: "激活顶部图层", shortcut: "Shift + Alt + ]" },
      { action: "调整当前图层透明度", shortcut: "0 至 9" },
      { action: "保留当前图层透明区域", shortcut: "/" },
      { action: "投影效果（效果对话框）", shortcut: "Ctrl + 1" },
      { action: "内阴影效果（效果对话框）", shortcut: "Ctrl + 2" },
    ],
  },
];

const QUICK_PICK = [
  {
    title: "最常用",
    detail: "保存、变换、撤销",
    shortcut: "Ctrl + S / Ctrl + T / Ctrl + Z",
  },
  {
    title: "选区操作",
    detail: "全选、取消、反选",
    shortcut: "Ctrl + A / Ctrl + D / Ctrl + Shift + I",
  },
  {
    title: "图层效率",
    detail: "复制、合并、盖印",
    shortcut: "Ctrl + J / Ctrl + E / Ctrl + Alt + E",
  },
];

export default function PhotoshopCheatSheet() {
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSections = useMemo(() => {
    if (!query.trim()) return SECTIONS;
    const keyword = query.trim().toLowerCase();
    return SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const haystack = `${item.action} ${item.shortcut}`.toLowerCase();
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
          PhotoShop快捷键速查表
        </h2>
        <p className="text-muted-foreground text-lg">
          工具、视图、图层与调整全覆盖，常用键一眼即用
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {QUICK_PICK.map((item) => (
            <button
              key={item.title}
              onClick={() => handleCopy(item.shortcut, `quick-${item.title}`)}
              className="text-left p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm text-emerald-500">
                <Palette className="w-4 h-4" />
                {item.title}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {item.detail}
              </p>
              <p className="text-xs font-mono mt-3 text-foreground">
                {item.shortcut}
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
              placeholder="搜索工具、功能或快捷键..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-black/5 dark:bg-white/5 border-none focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-3 items-center text-sm text-muted-foreground">
            <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5">
              共 {totalCount} 条快捷键
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
            <PhotoshopSection
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
            <p>未找到匹配的快捷键</p>
          </div>
        )}
      </div>
    </>
  );
}
