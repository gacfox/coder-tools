
"use client";

import { useMemo, useState } from "react";
import { Search, Compass } from "lucide-react";
import VimSection, { VimSection as VimSectionType } from "./components/VimSection";

const SECTIONS: VimSectionType[] = [
  {
    id: "cursor-move",
    title: "光标移动",
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    items: [
      { keys: "h", description: "光标左移，同 <Left> 键" },
      { keys: "j", description: "光标下移，同 <Down> 键" },
      { keys: "k", description: "光标上移，同 <Up> 键" },
      { keys: "l", description: "光标右移，同 <Right> 键" },
      { keys: "CTRL-F", description: "下一页" },
      { keys: "CTRL-B", description: "上一页" },
      { keys: "CTRL-U", description: "上移半屏" },
      { keys: "CTRL-D", description: "下移半屏" },
      { keys: "0", description: "跳到行首（数字零，不是字母O），等同 <Home>" },
      { keys: "^", description: "跳到行首第一个非空白字符" },
      { keys: "$", description: "跳到行尾，等同 <End>" },
      { keys: "gg", description: "跳到第一行，等同 CTRL+<Home>" },
      { keys: "G", description: "跳到最后一行，等同 CTRL+<End>" },
      { keys: "nG", description: "跳到第n行，比如 10G" },
      { keys: ":n", description: "跳到第n行，比如 :10<回车>" },
      { keys: "10%", description: "移动到文件 10% 处" },
      { keys: "15|", description: "移动到当前行的第 15 列" },
      { keys: "w", description: "跳到下一个单词开头（word）" },
      { keys: "W", description: "跳到下一个单词开头（WORD）" },
      { keys: "e", description: "跳到下一个单词尾部（word）" },
      { keys: "E", description: "跳到下一个单词尾部（WORD）" },
      { keys: "b", description: "上一个单词头（word）" },
      { keys: "B", description: "上一个单词头（WORD）" },
      { keys: "ge", description: "上一个单词尾" },
      { keys: ")", description: "向前移动一个句子（句号分隔）" },
      { keys: "(", description: "向后移动一个句子（句号分隔）" },
      { keys: "}", description: "向前移动一个段落（空行分隔）" },
      { keys: "{", description: "向后移动一个段落（空行分隔）" },
      { keys: "<enter>", description: "移动到下一行首个非空字符" },
      { keys: "+", description: "移动到下一行首个非空字符（同回车键）" },
      { keys: "-", description: "移动到上一行首个非空字符" },
      { keys: "H", description: "移动到屏幕上部" },
      { keys: "M", description: "移动到屏幕中部" },
      { keys: "L", description: "移动到屏幕下部" },
      { keys: "fx", description: "跳转到下一个为 x 的字符" },
      { keys: "Fx", description: "跳转到上一个为 x 的字符" },
      { keys: "tx", description: "跳转到下一个为 x 的字符前" },
      { keys: "Tx", description: "跳转到上一个为 x 的字符前" },
      { keys: ";", description: "跳到下一个 f/t 搜索的结果" },
      { keys: ",", description: "跳到上一个 f/t 搜索的结果" },
      { keys: "<S-Left>", description: "向左移动一个单词" },
      { keys: "<S-Right>", description: "向右移动一个单词" },
      { keys: "<S-Up>", description: "向上翻页" },
      { keys: "<S-Down>", description: "向下翻页" },
      { keys: "gm", description: "移动到行中" },
      { keys: "gj", description: "光标下移一行（忽略自动换行）" },
      { keys: "gk", description: "光标上移一行（忽略自动换行）" }
    ]
  },
  {
    id: "insert-enter-exit",
    title: "插入模式：进入退出",
    tone: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    items: [
      { keys: "i", description: "在光标处进入插入模式" },
      { keys: "I", description: "在行首进入插入模式" },
      { keys: "a", description: "在光标后进入插入模式" },
      { keys: "A", description: "在行尾进入插入模式" },
      { keys: "o", description: "在下一行插入新行并进入插入模式" },
      { keys: "O", description: "在上一行插入新行并进入插入模式" },
      { keys: "gi", description: "进入到上一次插入模式的位置" },
      { keys: "<ESC>", description: "退出插入模式" },
      { keys: "CTRL-[", description: "退出插入模式（同 ESC）" }
    ]
  },
  {
    id: "insert-mode",
    title: "INSERT MODE",
    description: "由 i, I, a, A, o, O 等进入插入模式后",
    tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    items: [
      { keys: "<Up>", description: "光标向上移动" },
      { keys: "<Down>", description: "光标向下移动" },
      { keys: "<Left>", description: "光标向左移动" },
      { keys: "<Right>", description: "光标向右移动" },
      { keys: "<S-Left>", description: "向左移动一个单词" },
      { keys: "<S-Right>", description: "向右移动一个单词" },
      { keys: "<S-Up>", description: "向上翻页" },
      { keys: "<S-Down>", description: "向下翻页" },
      { keys: "<PageUp>", description: "上翻页" },
      { keys: "<PageDown>", description: "下翻页" },
      { keys: "<Delete>", description: "删除光标处字符" },
      { keys: "<BS>", description: "Backspace 向后删除字符" },
      { keys: "<Home>", description: "光标跳转行首" },
      { keys: "<End>", description: "光标跳转行尾" },
      { keys: "CTRL-W", description: "向前删除单词" },
      { keys: "CTRL-O", description: "临时退出插入模式，执行单条命令又返回" },
      { keys: "CTRL-\\ CTRL-O", description: "临时退出插入模式（光标保持）" },
      { keys: "CTRL-R 0", description: "插入寄存器 0 号剪贴板内容" },
      { keys: "CTRL-R \"", description: "插入匿名寄存器内容（同插入模式下 p）" },
      { keys: "CTRL-R =", description: "插入表达式计算结果" },
      { keys: "CTRL-R :", description: "插入上一次命令行命令" },
      { keys: "CTRL-R /", description: "插入上一次搜索关键字" },
      { keys: "CTRL-F", description: "自动缩进" },
      { keys: "CTRL-U", description: "删除当前行所有字符" },
      { keys: "CTRL-V {char}", description: "插入非数字的字面量" },
      { keys: "CTRL-V {number}", description: "插入三个数字代表的 ascii/unicode 字符" },
      { keys: "CTRL-V 065", description: "插入 10 进制 ascii 字符（两数字）" },
      { keys: "CTRL-V x41", description: "插入 16 进制 ascii 字符（三数字）" },
      { keys: "CTRL-V o101", description: "插入 8 进制 ascii 字符（三数字）" },
      { keys: "CTRL-V u1234", description: "插入 16 进制 unicode 字符（四数字）" },
      { keys: "CTRL-V U12345678", description: "插入 16 进制 unicode 字符（八数字）" },
      { keys: "CTRL-K {ch1} {ch2}", description: "插入 digraph" },
      { keys: "CTRL-D", description: "文字向前缩进" },
      { keys: "CTRL-T", description: "文字向后缩进" }
    ]
  },
  {
    id: "editing",
    title: "文本编辑",
    tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    items: [
      { keys: "r", description: "替换当前字符" },
      { keys: "R", description: "进入替换模式，直至 ESC 离开" },
      { keys: "s", description: "替换字符并进入插入模式（可接数量）" },
      { keys: "S", description: "替换行并进入插入模式" },
      { keys: "cc", description: "改写当前行（同 S）" },
      { keys: "cw", description: "改写光标开始处的当前单词" },
      { keys: "ciw", description: "改写光标所处的单词" },
      { keys: "caw", description: "改写单词并包含前后空格" },
      { keys: "c0", description: "改写到行首" },
      { keys: "c^", description: "改写到行首第一个非空字符" },
      { keys: "c$", description: "改写到行末" },
      { keys: "C", description: "改写到行尾（同 c$）" },
      { keys: "ci\"", description: "改写双引号中的内容" },
      { keys: "ci'", description: "改写单引号中的内容" },
      { keys: "cib", description: "改写小括号中的内容" },
      { keys: "cab", description: "改写小括号中的内容（含括号）" },
      { keys: "ci)", description: "改写小括号中的内容" },
      { keys: "ci]", description: "改写中括号中内容" },
      { keys: "ciB", description: "改写大括号中内容" },
      { keys: "caB", description: "改写大括号中内容（含括号）" },
      { keys: "ci}", description: "改写大括号中内容" },
      { keys: "cit", description: "改写 XML tag 中内容" },
      { keys: "cis", description: "改写当前句子" },
      { keys: "c2w", description: "改写下两个单词" },
      { keys: "ct(", description: "改写到小括号前" },
      { keys: "c/apple", description: "改写到光标后的第一个 apple 前" },
      { keys: "x", description: "删除当前字符（可接数量）" },
      { keys: "X", description: "向前删除字符" },
      { keys: "dd", description: "删除当前行" },
      { keys: "d0", description: "删除到行首" },
      { keys: "d^", description: "删除到行首第一个非空字符" },
      { keys: "d$", description: "删除到行末" },
      { keys: "D", description: "删除到行末（同 d$）" },
      { keys: "dw", description: "删除当前单词" },
      { keys: "diw", description: "删除光标所处的单词" },
      { keys: "daw", description: "删除单词并包含前后空格" },
      { keys: "di\"", description: "删除双引号中的内容" },
      { keys: "di'", description: "删除单引号中的内容" },
      { keys: "dib", description: "删除小括号中的内容" },
      { keys: "di)", description: "删除小括号中的内容" },
      { keys: "dab", description: "删除小括号内内容（含括号）" },
      { keys: "di]", description: "删除中括号中内容" },
      { keys: "diB", description: "删除大括号中内容" },
      { keys: "di}", description: "删除大括号中内容" },
      { keys: "daB", description: "删除大括号内内容（含括号）" },
      { keys: "dit", description: "删除 XML tag 中内容" },
      { keys: "dis", description: "删除当前句子" },
      { keys: "dip", description: "删除当前段落（前后空白行）" },
      { keys: "dap", description: "删除当前段落（含空白行）" },
      { keys: "d2w", description: "删除下两个单词" },
      { keys: "dt(", description: "删除到小括号前" },
      { keys: "d/apple", description: "删除到光标后的第一个 apple 前" },
      { keys: "dgg", description: "删除到文件头部" },
      { keys: "dG", description: "删除到文件尾部" },
      { keys: "d}", description: "删除下一段" },
      { keys: "d{", description: "删除上一段" },
      { keys: "u", description: "撤销" },
      { keys: "U", description: "撤销整行操作" },
      { keys: "CTRL-R", description: "撤销上一次 u 命令" },
      { keys: "J", description: "链接多行为一行" },
      { keys: ".", description: "重复上一次操作" },
      { keys: "~", description: "替换大小写" },
      { keys: "g~iw", description: "替换当前单词大小写" },
      { keys: "gUiw", description: "将单词转成大写" },
      { keys: "guiw", description: "将单词转成小写" },
      { keys: "guu", description: "全行转为小写" },
      { keys: "gUU", description: "全行转为大写" },
      { keys: "<<", description: "减少缩进" },
      { keys: ">>", description: "增加缩进" },
      { keys: "==", description: "自动缩进" },
      { keys: "CTRL-A", description: "增加数字" },
      { keys: "CTRL-X", description: "减少数字" }
    ]
  },
  {
    id: "copy-paste",
    title: "复制粘贴",
    tone: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    items: [
      { keys: "p", description: "粘贴到光标后" },
      { keys: "P", description: "粘贴到光标前" },
      { keys: "v", description: "开始标记" },
      { keys: "y", description: "复制标记内容" },
      { keys: "V", description: "开始按行标记" },
      { keys: "CTRL-V", description: "开始列标记" },
      { keys: "y$", description: "复制当前位置到本行结束的内容" },
      { keys: "yy", description: "复制当前行" },
      { keys: "Y", description: "复制当前行，同 yy" },
      { keys: "yiw", description: "复制当前单词" },
      { keys: "3yy", description: "复制光标下三行内容" },
      { keys: "v0", description: "选中当前位置到行首" },
      { keys: "v$", description: "选中当前位置到行末" },
      { keys: "viw", description: "选中当前单词" },
      { keys: "vib", description: "选中小括号内" },
      { keys: "vi)", description: "选中小括号内" },
      { keys: "vi]", description: "选中中括号内" },
      { keys: "viB", description: "选中大括号内" },
      { keys: "vi}", description: "选中大括号内" },
      { keys: "vis", description: "选中句子中的东西" },
      { keys: "vip", description: "选中当前段落（前后空白行）" },
      { keys: "vap", description: "选中当前段落（含空白行）" },
      { keys: "vab", description: "选中小括号内（含括号）" },
      { keys: "va)", description: "选中小括号内（含括号）" },
      { keys: "va]", description: "选中中括号内（含括号）" },
      { keys: "vaB", description: "选中大括号内（含括号）" },
      { keys: "va}", description: "选中大括号内（含括号）" },
      { keys: "gv", description: "重新选择上一次选中的文字" },
      { keys: ":set paste", description: "允许粘贴模式（避免缩进影响）" },
      { keys: ":set nopaste", description: "禁止粘贴模式" },
      { keys: "\"?yy", description: "复制当前行到寄存器 ?（0-9）" },
      { keys: "\"?d3j", description: "删除三行并放到寄存器 ?（0-9）" },
      { keys: "\"?p", description: "将寄存器 ? 内容粘贴到光标后" },
      { keys: "\"?P", description: "将寄存器 ? 内容粘贴到光标前" },
      { keys: ":registers", description: "显示所有寄存器内容" },
      { keys: ":[range]y", description: "复制范围，如 :20,30y 或 :10y" },
      { keys: ":[range]d", description: "删除范围，如 :20,30d 或 :10d" },
      { keys: "ddp", description: "交换两行内容" },
      { keys: "\"_[command]", description: "删除但不复制（不污染寄存器）" },
      { keys: "\"*[command]", description: "复制到系统剪贴板（需 clipboard 支持）" }
    ]
  },
  {
    id: "text-objects",
    title: "文本对象",
    description: "c,d,v,y 等命令后接文本对象：<范围 i/a><类型>",
    tone: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    items: [
      { keys: "$", description: "到行末" },
      { keys: "0", description: "到行首" },
      { keys: "^", description: "到行首非空字符" },
      { keys: "tx", description: "光标位置到字符 x 之前" },
      { keys: "fx", description: "光标位置到字符 x 之处" },
      { keys: "iw", description: "整个单词（不含分隔符）" },
      { keys: "aw", description: "整个单词（含分隔符）" },
      { keys: "iW", description: "整个 WORD（不含分隔符）" },
      { keys: "aW", description: "整个 WORD（含分隔符）" },
      { keys: "is", description: "整个句子（不含分隔符）" },
      { keys: "as", description: "整个句子（含分隔符）" },
      { keys: "ip", description: "整个段落（不含前后空白行）" },
      { keys: "ap", description: "整个段落（含前后空白行）" },
      { keys: "ib", description: "小括号内" },
      { keys: "ab", description: "小括号内（含括号）" },
      { keys: "iB", description: "大括号内" },
      { keys: "aB", description: "大括号内（含括号）" },
      { keys: "i)", description: "小括号内" },
      { keys: "a)", description: "小括号内（含括号）" },
      { keys: "i]", description: "中括号内" },
      { keys: "a]", description: "中括号内（含括号）" },
      { keys: "i}", description: "大括号内" },
      { keys: "a}", description: "大括号内（含括号）" },
      { keys: "i'", description: "单引号内" },
      { keys: "a'", description: "单引号内（含引号）" },
      { keys: "i\"", description: "双引号内" },
      { keys: "a\"", description: "双引号内（含引号）" },
      { keys: "2i)", description: "往外两层小括号内" },
      { keys: "2a)", description: "往外两层小括号内（含括号）" },
      { keys: "2f)", description: "到第二个小括号处" },
      { keys: "2t)", description: "到第二个小括号前" }
    ]
  },
  {
    id: "search-replace",
    title: "查找替换",
    tone: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20",
    items: [
      { keys: "/pattern", description: "从光标处向文件尾搜索 pattern" },
      { keys: "?pattern", description: "从光标处向文件头搜索 pattern" },
      { keys: "n", description: "向同一方向执行上一次搜索" },
      { keys: "N", description: "向相反方向执行上一次搜索" },
      { keys: "*", description: "向前搜索光标下的单词" },
      { keys: "#", description: "向后搜索光标下的单词" },
      { keys: ":s/p1/p2/g", description: "将当前行中全替换 p1 为 p2" },
      { keys: ":%s/p1/p2/g", description: "将当前文件中全替换 p1 为 p2" },
      { keys: ":%s/p1/p2/gc", description: "全替换并逐处确认" },
      { keys: ":10,20s/p1/p2/g", description: "替换第10到20行中的 p1" },
      { keys: ":., ns/p1/p2/g", description: "替换当前行到 n 行" },
      { keys: ":., +10s/p1/p2/g", description: "替换当前行到当前行+10行" },
      { keys: ":., $s/p1/p2/g", description: "替换当前行到最后一行" },
      { keys: ":0,.s/p1/p2/g", description: "替换第一行到当前行" },
      { keys: ":%s/1\\2\/3/123/g", description: "替换“1\\2/3”为“123”" },
      { keys: ":%s/\\r//g", description: "删除 DOS 换行符 ^M" }
    ]
  },
  {
    id: "visual-mode",
    title: "VISUAL MODE",
    description: "由 v, V, CTRL-V 进入的可视模式",
    tone: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    items: [
      { keys: ">", description: "增加缩进" },
      { keys: "<", description: "减少缩进" },
      { keys: "d", description: "删除高亮选中的文字" },
      { keys: "x", description: "删除高亮选中的文字" },
      { keys: "c", description: "改写文字并进入插入模式" },
      { keys: "s", description: "改写文字并进入插入模式" },
      { keys: "y", description: "拷贝文字" },
      { keys: "~", description: "转换大小写" },
      { keys: "o", description: "跳转到标记区的另外一端" },
      { keys: "O", description: "跳转到标记块的另外一端" },
      { keys: "u", description: "标记区转换为小写" },
      { keys: "U", description: "标记区转换为大写" },
      { keys: "g CTRL-G", description: "显示所选择区域的统计信息" },
      { keys: "<Esc>", description: "退出可视模式" }
    ]
  },
  {
    id: "jump",
    title: "位置跳转",
    tone: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    items: [
      { keys: "CTRL-O", description: "跳转到上一个位置" },
      { keys: "CTRL-I", description: "跳转到下一个位置" },
      { keys: "CTRL-^", description: "跳转到 alternate file（上一个文件）" },
      { keys: "CTRL-]", description: "跳转到光标下文字的超链接" },
      { keys: "CTRL-T", description: "返回到跳转之前的位置" },
      { keys: "%", description: "跳转到 {} () [] 的匹配" },
      { keys: "gd", description: "跳转到局部定义" },
      { keys: "gD", description: "跳转到全局定义" },
      { keys: "gf", description: "打开光标下文件名对应文件" },
      { keys: "[[", description: "跳转到上一个顶层函数" },
      { keys: "]]", description: "跳转到下一个顶层函数" },
      { keys: "[m", description: "跳转到上一个成员函数" },
      { keys: "]m", description: "跳转到下一个成员函数" },
      { keys: "[{", description: "跳转到上一处未匹配的 {" },
      { keys: "]}", description: "跳转到下一处未匹配的 }" },
      { keys: "[(", description: "跳转到上一处未匹配的 (" },
      { keys: "])", description: "跳转到下一处未匹配的 )" },
      { keys: "[c", description: "上一个不同处（diff）" },
      { keys: "]c", description: "下一个不同处（diff）" },
      { keys: "[/", description: "跳转到 C 注释开头" },
      { keys: "]/", description: "跳转到 C 注释结尾" },
      { keys: "``", description: "回到上次跳转的位置" },
      { keys: "''", description: "回到上次跳转的位置" },
      { keys: "`.", description: "回到上次编辑的位置" },
      { keys: "'.", description: "回到上次编辑的位置" }
    ]
  },
  {
    id: "file-ops",
    title: "文件操作",
    tone: "bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-500/20",
    items: [
      { keys: ":w", description: "保存文件" },
      { keys: ":w <filename>", description: "按名称保存文件" },
      { keys: ":e <filename>", description: "打开文件并编辑" },
      { keys: ":saveas <filename>", description: "另存为文件" },
      { keys: ":r <filename>", description: "读取文件并插入到光标后" },
      { keys: ":r !dir", description: "将 dir 输出捕获并插入" },
      { keys: ":close", description: "关闭文件" },
      { keys: ":q", description: "退出" },
      { keys: ":q!", description: "强制退出" },
      { keys: ":wa", description: "保存所有文件" },
      { keys: ":cd <path>", description: "切换 Vim 当前路径" },
      { keys: ":pwd", description: "显示 Vim 当前路径" },
      { keys: ":new", description: "新窗口编辑新文件" },
      { keys: ":enew", description: "当前窗口创建新文件" },
      { keys: ":vnew", description: "左右切分新窗口" },
      { keys: ":tabnew", description: "新标签页中编辑新文件" }
    ]
  },
  {
    id: "buffer-ops",
    title: "已打开文件操作",
    tone: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    items: [
      { keys: ":ls", description: "查看缓存列表" },
      { keys: ":bn", description: "切换到下一个缓存" },
      { keys: ":bp", description: "切换到上一个缓存" },
      { keys: ":bd", description: "删除缓存" },
      { keys: ":b 1", description: "切换到 1 号缓存" },
      { keys: ":b abc", description: "切换到文件名 abc 开头的缓存" },
      { keys: ":badd <filename>", description: "将文件添加到缓存列表" },
      { keys: ":set hidden", description: "开启隐藏模式" },
      { keys: ":set nohidden", description: "关闭隐藏模式" },
      { keys: "n CTRL-^", description: "按编号切换缓存" }
    ]
  },
  {
    id: "window-ops",
    title: "窗口操作",
    tone: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    items: [
      { keys: ":sp <filename>", description: "上下切分窗口打开文件" },
      { keys: ":vs <filename>", description: "左右切分窗口打开文件" },
      { keys: "CTRL-W s", description: "上下切分窗口" },
      { keys: "CTRL-W v", description: "左右切分窗口" },
      { keys: "CTRL-W w", description: "切换到下一个窗口" },
      { keys: "CTRL-W W", description: "切换到上一个窗口" },
      { keys: "CTRL-W p", description: "跳到上一个访问过的窗口" },
      { keys: "CTRL-W c", description: "关闭当前窗口" },
      { keys: "CTRL-W o", description: "关闭其他窗口" },
      { keys: "CTRL-W h", description: "跳到左边窗口" },
      { keys: "CTRL-W j", description: "跳到下边窗口" },
      { keys: "CTRL-W k", description: "跳到上边窗口" },
      { keys: "CTRL-W l", description: "跳到右边窗口" },
      { keys: "CTRL-W +", description: "增加当前窗口行高" },
      { keys: "CTRL-W -", description: "减少当前窗口行高" },
      { keys: "CTRL-W <", description: "减少当前窗口列宽" },
      { keys: "CTRL-W >", description: "增加当前窗口列宽" },
      { keys: "CTRL-W =", description: "让所有窗口宽高相同" },
      { keys: "CTRL-W H", description: "移动当前窗口到最左" },
      { keys: "CTRL-W J", description: "移动当前窗口到最下" },
      { keys: "CTRL-W K", description: "移动当前窗口到最上" },
      { keys: "CTRL-W L", description: "移动当前窗口到最右" },
      { keys: "CTRL-W x", description: "交换窗口" },
      { keys: "CTRL-W f", description: "新窗口打开光标下文件名" },
      { keys: "CTRL-W gf", description: "新标签页打开光标下文件名" },
      { keys: "CTRL-W R", description: "旋转窗口" },
      { keys: "CTRL-W T", description: "当前窗口移到新标签页" },
      { keys: "CTRL-W P", description: "跳转到预览窗口" },
      { keys: "CTRL-W z", description: "关闭预览窗口" },
      { keys: "CTRL-W _", description: "纵向最大化当前窗口" },
      { keys: "CTRL-W |", description: "横向最大化当前窗口" }
    ]
  },
  {
    id: "tabs",
    title: "标签页",
    tone: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    items: [
      { keys: ":tabs", description: "显示所有标签页" },
      { keys: ":tabe <filename>", description: "新标签页打开文件" },
      { keys: ":tabn", description: "下一个标签页" },
      { keys: ":tabp", description: "上一个标签页" },
      { keys: ":tabc", description: "关闭当前标签页" },
      { keys: ":tabo", description: "关闭其他标签页" },
      { keys: ":tabn n", description: "切换到第 n 个标签页" },
      { keys: ":tabm n", description: "标签移动" },
      { keys: ":tabfirst", description: "切换到第一个标签页" },
      { keys: ":tablast", description: "切换到最后一个标签页" },
      { keys: ":tab help", description: "在标签页打开帮助" },
      { keys: ":tab drop <file>", description: "若已打开则跳过去，否则新开" },
      { keys: ":tab split", description: "新标签页打开当前窗口文件" },
      { keys: ":tab ball", description: "将缓存中所有文件用标签页打开" },
      { keys: ":set showtabline=?", description: "设置标签页显示规则" },
      { keys: "ngt", description: "切换到第 n 个标签页，如 2gt" },
      { keys: "gt", description: "下一个标签页" },
      { keys: "gT", description: "上一个标签页" }
    ]
  },
  {
    id: "marks",
    title: "书签",
    tone: "bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/20",
    items: [
      { keys: ":marks", description: "显示所有书签" },
      { keys: "ma", description: "保存当前位置到书签 a" },
      { keys: "'a", description: "跳转到书签 a 所在行" },
      { keys: "`a", description: "跳转到书签 a 所在位置" },
      { keys: "`.", description: "跳转到上一次编辑的行" },
      { keys: "'A", description: "跳转到全文书签 A" },
      { keys: "['", description: "跳转到上一个书签" },
      { keys: "]'", description: "跳转到下一个书签" },
      { keys: "'<", description: "跳到上次可视模式选择区域开始" },
      { keys: "'>", description: "跳到上次可视模式选择区域结束" },
      { keys: ":delm a", description: "删除缓冲区书签 a" },
      { keys: ":delm A", description: "删除文件书签 A" },
      { keys: ":delm!", description: "删除所有缓冲区书签（小写）" },
      { keys: ":delm A-Z", description: "删除所有文件书签（大写）" },
      { keys: ":delm 0-9", description: "删除所有数字书签" },
      { keys: ":delm A-Z0-9", description: "删除所有文件和数字书签" }
    ]
  },
  {
    id: "settings",
    title: "常用设置",
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    items: [
      { keys: ":set nocompatible", description: "不兼容原始 vi 模式" },
      { keys: ":set bs=?", description: "设置 BS 键模式" },
      { keys: ":set sw=4", description: "设置缩进宽度为 4" },
      { keys: ":set ts=4", description: "设置制表符宽度为 4" },
      { keys: ":set noet", description: "不展开 tab 成空格" },
      { keys: ":set et", description: "展开 tab 成空格" },
      { keys: ":set winaltkeys=no", description: "GVim 下捕获 ALT 键" },
      { keys: ":set nowrap", description: "关闭自动换行" },
      { keys: ":set ttimeout", description: "允许终端按键检测超时" },
      { keys: ":set ttm=100", description: "终端按键检测超时 100ms" },
      { keys: ":set term=?", description: "设置终端类型" },
      { keys: ":set ignorecase", description: "搜索忽略大小写" },
      { keys: ":set noignorecase", description: "搜索区分大小写" },
      { keys: ":set smartcase", description: "智能大小写" },
      { keys: ":set list", description: "显示制表符和换行符" },
      { keys: ":set number", description: "显示行号" },
      { keys: ":set relativenumber", description: "显示相对行号" },
      { keys: ":set paste", description: "进入粘贴模式" },
      { keys: ":set nopaste", description: "结束粘贴模式" },
      { keys: ":set spell", description: "允许拼写检查" },
      { keys: ":set hlsearch", description: "高亮查找" },
      { keys: ":set ruler", description: "总是显示光标位置" },
      { keys: ":set incsearch", description: "动态增量搜索" },
      { keys: ":set insertmode", description: "Vim 始终处于插入模式" },
      { keys: ":set all", description: "列出所有选项设置情况" },
      { keys: ":syntax on", description: "允许语法高亮" },
      { keys: ":syntax off", description: "禁止语法高亮" }
    ]
  },
  {
    id: "help",
    title: "帮助信息",
    tone: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    items: [
      { keys: ":h tutor", description: "入门文档" },
      { keys: ":h quickref", description: "快速帮助" },
      { keys: ":h index", description: "查询所有键盘命令定义" },
      { keys: ":h summary", description: "帮助你更好使用内置帮助" },
      { keys: ":h CTRL-H", description: "查询普通模式下 CTRL-H" },
      { keys: ":h i_CTRL-H", description: "查询插入模式下 CTRL-H" },
      { keys: ":h i_<Up>", description: "查询插入模式方向键上" },
      { keys: ":h pattern.txt", description: "正则表达式帮助" },
      { keys: ":h eval", description: "脚本编写帮助" },
      { keys: ":h function-list", description: "查看 VimScript 函数列表" },
      { keys: ":h windows.txt", description: "窗口使用帮助" },
      { keys: ":h tabpage.txt", description: "标签页使用帮助" },
      { keys: ":h +timers", description: "显示 +timers 特性帮助" },
      { keys: ":h :!", description: "查看如何运行外部命令" },
      { keys: ":h tips", description: "查看 Vim 内置常用技巧文档" },
      { keys: ":h set-termcap", description: "查看按键扫描码设置" },
      { keys: ":viusage", description: "NORMAL 模式帮助" },
      { keys: ":exusage", description: "EX 命令帮助" },
      { keys: ":version", description: "显示 Vim 版本号和特性" }
    ]
  },
  {
    id: "external",
    title: "外部命令",
    tone: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    items: [
      { keys: ":!ls", description: "运行外部命令 ls 并等待返回" },
      { keys: ":r !ls", description: "将外部命令输出插入到光标后" },
      { keys: ":w !sudo tee %", description: "sudo 后保存当前文件" },
      { keys: ":call system('ls')", description: "调用 ls 命令但不显示返回内容" },
      { keys: ":!start notepad", description: "Windows 下启动 notepad" },
      { keys: ":sil !start cmd", description: "Windows 下当前目录打开 cmd" },
      { keys: ":%!prog", description: "运行文字过滤程序" }
    ]
  },
  {
    id: "quickfix",
    title: "Quickfix 窗口",
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    items: [
      { keys: ":copen", description: "打开 quickfix 窗口" },
      { keys: ":copen 10", description: "打开 quickfix 窗口并设高 10" },
      { keys: ":cclose", description: "关闭 quickfix 窗口" },
      { keys: ":cfirst", description: "跳到第一个错误信息" },
      { keys: ":clast", description: "跳到最后一条错误信息" },
      { keys: ":cc [nr]", description: "查看错误 [nr]" },
      { keys: ":cnext", description: "跳到下一个错误信息" },
      { keys: ":cprev", description: "跳到上一个错误信息" }
    ]
  },
  {
    id: "spell",
    title: "拼写检查",
    tone: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    items: [
      { keys: ":set spell", description: "打开拼写检查" },
      { keys: ":set nospell", description: "关闭拼写检查" },
      { keys: "]s", description: "下一处错误拼写的单词" },
      { keys: "[s", description: "上一处错误拼写的单词" },
      { keys: "zg", description: "加入单词到拼写词表中" },
      { keys: "zug", description: "撤销上一次加入的单词" },
      { keys: "z=", description: "拼写建议" }
    ]
  },
  {
    id: "fold",
    title: "代码折叠",
    tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    items: [
      { keys: "za", description: "切换折叠" },
      { keys: "zA", description: "递归切换折叠" },
      { keys: "zc", description: "折叠光标下代码" },
      { keys: "zC", description: "折叠光标下所有代码" },
      { keys: "zd", description: "删除光标下折叠" },
      { keys: "zD", description: "递归删除所有折叠" },
      { keys: "zE", description: "删除所有折叠" },
      { keys: "zf", description: "创建代码折叠" },
      { keys: "zF", description: "指定行数创建折叠" },
      { keys: "zi", description: "切换折叠" },
      { keys: "zm", description: "所有代码折叠一层" },
      { keys: "zr", description: "所有代码打开一层" },
      { keys: "zM", description: "折叠所有代码" },
      { keys: "zR", description: "打开所有代码" },
      { keys: "zn", description: "折叠 none，重置 foldenable" },
      { keys: "zN", description: "折叠 normal，恢复所有折叠" },
      { keys: "zo", description: "打开一层代码" },
      { keys: "zO", description: "打开光标下所有折叠" }
    ]
  },
  {
    id: "macros",
    title: "宏录制",
    tone: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    items: [
      { keys: "qa", description: "开始录制名字为 a 的宏" },
      { keys: "q", description: "结束录制宏" },
      { keys: "@a", description: "播放名字为 a 的宏" },
      { keys: "@@", description: "播放上一个宏" },
      { keys: "@:", description: "重复上一个 ex 命令" }
    ]
  },
  {
    id: "misc",
    title: "其他命令",
    tone: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    items: [
      { keys: "CTRL-X CTRL-F", description: "插入模式下文件路径补全" },
      { keys: "CTRL-X CTRL-O", description: "插入 Omnifunc 补全" },
      { keys: "CTRL-X CTRL-N", description: "插入模式下关键字补全" },
      { keys: "CTRL-X CTRL-E", description: "插入模式下向上滚屏" },
      { keys: "CTRL-X CTRL-Y", description: "插入模式下向下滚屏" },
      { keys: "CTRL-E", description: "向上滚屏" },
      { keys: "CTRL-Y", description: "向下滚屏" },
      { keys: "CTRL-G", description: "显示文件名、大小和位置信息" },
      { keys: "g CTRL-G", description: "显示文件大小、字符数、单词数和行数" },
      { keys: "zz", description: "光标行置中" },
      { keys: "zt", description: "光标行置顶" },
      { keys: "zb", description: "光标行置底" },
      { keys: "ga", description: "显示光标下字符的 ascii/unicode" },
      { keys: "g8", description: "显示光标下字符的 utf-8 字节序" },
      { keys: "gi", description: "回到上次进入插入的地方并切换" },
      { keys: "K", description: "查询光标下单词的帮助" },
      { keys: "ZZ", description: "保存并关闭窗口" },
      { keys: "ZQ", description: "不保存关闭窗口" },
      { keys: "CTRL-PgUp", description: "上个标签页（GVim）" },
      { keys: "CTRL-PgDown", description: "下个标签页（GVim）" },
      { keys: "CTRL-R CTRL-W", description: "命令模式插入光标下单词" },
      { keys: "CTRL-INSERT", description: "复制到系统剪贴板（GVim）" },
      { keys: "SHIFT-INSERT", description: "粘贴系统剪贴板内容（GVim）" },
      { keys: ":set ff=unix", description: "设置换行为 unix" },
      { keys: ":set ff=dos", description: "设置换行为 dos" },
      { keys: ":set ff?", description: "查看换行设置" },
      { keys: ":set nohl", description: "清除搜索高亮" },
      { keys: ":set termcap", description: "查看终端收发命令" },
      { keys: ":set guicursor=", description: "解决 NeoVim 局部奇怪字符" },
      { keys: ":set t_RS= t_SH=", description: "解决 Vim8 终端功能奇怪字符" },
      { keys: ":set fo+=a", description: "实时自动格式化文本段" },
      { keys: ":earlier 15m", description: "回退到 15 分钟前内容" },
      { keys: ":.!date", description: "插入当前时间" },
      { keys: ":%!xxd", description: "开始二进制编辑" },
      { keys: ":%!xxd -r", description: "保存二进制编辑" },
      { keys: ":r !curl -sL {URL}", description: "读取 url 内容添加到光标后" },
      { keys: ":g/^\\s*$/d", description: "删除空行" },
      { keys: ":g/green/d", description: "删除包含 green 的行" },
      { keys: ":v/green/d", description: "删除不包含 green 的行" },
      { keys: ":g/gladiolli/#", description: "搜索单词并打印结果" },
      { keys: ":g/ab.*cd.*efg/#", description: "搜索包含 ab/cd/efg 的行" },
      { keys: ":v/./,/./-j", description: "压缩空行" },
      { keys: ":Man bash", description: "Vim 中查看 man（先激活插件）" },
      { keys: "/fred\\|joe", description: "搜索 fred 或 joe" },
      { keys: "/\\<\\d\\d\\d\\d\\>", description: "精确搜索四个数字" },
      { keys: "/^\\n\\{3}", description: "搜索连续三个空行" }
    ]
  },
  {
    id: "plugin-commentary",
    title: "Plugin - vim-commentary",
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    items: [
      { keys: "gcc", description: "注释当前行" },
      { keys: "gc{motion}", description: "注释 {motion} 区域，如 gcap" },
      { keys: "gci{", description: "注释大括号内内容" },
      { keys: "gc", description: "可视模式下注释选中区域" },
      { keys: ":7,17Commentary", description: "注释 7 到 17 行" }
    ]
  },
  {
    id: "plugin-easy-align",
    title: "Plugin - vim-easy-align",
    tone: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    items: [
      { keys: ":EasyAlign =", description: "以第一个匹配的 = 为中心对齐" },
      { keys: ":EasyAlign *=", description: "匹配并对齐所有 =" }
    ]
  },
  {
    id: "plugin-unimpaired",
    title: "Plugin - vim-unimpaired",
    tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    items: [
      { keys: "[space", description: "向上插入空行" },
      { keys: "]space", description: "向下插入空行" },
      { keys: "[e", description: "替换当前行和上一行" },
      { keys: "]e", description: "替换当前行和下一行" },
      { keys: "[x", description: "XML 编码" },
      { keys: "]x", description: "XML 解码" },
      { keys: "[u", description: "URL 编码" },
      { keys: "]u", description: "URL 解码" },
      { keys: "[y", description: "C 字符串编码" },
      { keys: "]y", description: "C 字符串解码" },
      { keys: "[q", description: "上一个 quickfix 错误" },
      { keys: "]q", description: "下一个 quickfix 错误" },
      { keys: "[Q", description: "第一个 quickfix 错误" },
      { keys: "]Q", description: "最后一个 quickfix 错误" },
      { keys: "[f", description: "切换同目录上一个文件" },
      { keys: "]f", description: "切换同目录下一个文件" },
      { keys: "[os", description: "设置 :set spell" },
      { keys: "]os", description: "设置 :set nospell" },
      { keys: "=os", description: "设置 :set invspell" },
      { keys: "[on", description: "显示行号" },
      { keys: "]on", description: "关闭行号" },
      { keys: "[ol", description: "显示回车和制表符" },
      { keys: "]ol", description: "不显示回车和制表符" },
      { keys: "[b", description: "缓存切换到上一个文件" },
      { keys: "]b", description: "缓存切换到下一个文件" },
      { keys: "[B", description: "缓存切换到第一个文件" },
      { keys: "]B", description: "缓存切换到最后一个文件" }
    ]
  },
  {
    id: "plugin-asyncrun",
    title: "Plugin - asyncrun.vim",
    tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    items: [
      { keys: ":AsyncRun ls", description: "异步运行命令 ls，输出到 quickfix" },
      { keys: ":AsyncRun -raw ls", description: "输出不匹配 errorformat" }
    ]
  },
  {
    id: "plugin-textobj-argument",
    title: "Plugin - vim-textobj-argument",
    tone: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20",
    items: [
      { keys: "cia", description: "改写函数参数" },
      { keys: "caa", description: "改写函数参数（含逗号分隔）" },
      { keys: "dia", description: "删除函数参数" },
      { keys: "daa", description: "删除函数参数（含逗号分隔）" },
      { keys: "via", description: "选取函数参数" },
      { keys: "vaa", description: "选取函数参数（含逗号分隔）" },
      { keys: "yia", description: "复制函数参数" },
      { keys: "yaa", description: "复制函数参数（含逗号分隔）" }
    ]
  }
];

const RESOURCES = [
  { label: "最新版本", url: "https://github.com/vim/vim" },
  { label: "Windows 最新版", url: "https://github.com/vim/vim-win32-installer/releases" },
  { label: "插件浏览", url: "http://vimawesome.com" },
  { label: "reddit", url: "https://www.reddit.com/r/vim/" },
  { label: "正确设置 ALT/BS 键", url: "https://skywind.me/blog/archives/2021" },
  { label: "视频教程", url: "http://vimcasts.org/" },
  { label: "中文帮助", url: "http://vimcdoc.sourceforge.net/doc/help.html" },
  { label: "中文版入门到精通", url: "https://github.com/wsdjeg/vim-galore-zh_cn" },
  { label: "五分钟脚本入门", url: "https://skywind.me/blog/archives/2193" },
  { label: "脚本精通", url: "http://learnvimscriptthehardway.stevelosh.com/" },
  { label: "中文脚本帮助", url: "http://vimcdoc.sourceforge.net/doc/eval.html" },
  { label: "十六年使用经验", url: "http://zzapper.co.uk/vimtips.html" },
  { label: "配色方案", url: "http://vimcolors.com/" }
];

const TIPS = [
  "永远不要用 CTRL-C 代替 <ESC>，含义不同，可能中断后台脚本",
  "很多人用 CTRL-[ 代替 <ESC>，左手 CTRL 右手 [ 更顺手",
  "终端里 Vim 8 内嵌终端如看到奇怪字符，使用 :set t_RS= t_SH=",
  "终端里 Vim 8.2+ 如看到奇怪字符，使用 :set t_TI= t_TE=",
  "NeoVim 如看到奇怪字符，使用 :set guicursor=",
  "MS-Terminal 进入 Vim/NVim 默认替换模式：:set t_u7=",
  "多用 ciw/ci[/ci\"/ci( 与 diw/di[/di\"/di( 进行快编",
  "行内移动多用 w b e 或 W B E，不要只用 h l/方向键",
  "SHIFT 是移动加速键，W B E 走得更快",
  "用 0w 比 ^ 更容易移动到行首非空字符",
  "空白行使用 dip 可删除临近空白行，viw 选择连续空白",
  "缩进时使用 >8j >} <ap >ap =i} == 更方便",
  "插入模式下写错单词，CTRL-W 比 <BackSpace> 快",
  "y d c 可结合 f t 和 /X，例如 dt) 和 y/end<cr>",
  "c d x 会填充寄存器 \"1 到 \"9，y 填充 \"0",
  "v 选择文本时，可用 o 掉头选择",
  "写文章时可选中代码块执行 :!python 直接替换为结果",
  "搜索后常用 :nohl 清除高亮，可 map 到 <BackSpace>",
  "搜索可用 CTRL-R CTRL-W 插入光标下单词",
  "映射按键应优先使用 noremap",
  "感觉效率低时，先 u u u u 再思考更高效方式",
  "y 复制文本后，命令模式 CTRL-R 再按 0 可插入复制内容",
  "某些情况下高亮慢可试试 set re=1 使用老正则引擎",
  "Windows 下 GVim 可设置 set rop=type:directx,renmode:5"
];

export default function VimCheatSheet() {
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSections = useMemo(() => {
    if (!query.trim()) return SECTIONS;
    const keyword = query.trim().toLowerCase();
    return SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const haystack = `${item.keys} ${item.description}`.toLowerCase();
        return haystack.includes(keyword);
      })
    })).filter((section) => section.items.length > 0);
  }, [query]);

  const totalCount = useMemo(
    () => SECTIONS.reduce((sum, section) => sum + section.items.length, 0),
    []
  );

  const matchedCount = useMemo(
    () => filteredSections.reduce((sum, section) => sum + section.items.length, 0),
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
        <h2 className="text-3xl font-bold tracking-tight">Vim指令速查表</h2>
        <p className="text-muted-foreground text-lg">
          光标移动、编辑操作、窗口管理与插件快捷键一站式速查
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40 space-y-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索指令、描述..."
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
            <VimSection
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-black/10 dark:border-white/10">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">网络资源</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              {RESOURCES.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">常用技巧</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {TIPS.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500/60" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
