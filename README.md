# Code Tools 开发者小工具网站

Code Tools是一个为开发者设计的在线工具网站。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgacfox%2Fcoder-tools)

## 功能特性

![](doc/1.png)

### 编解码转换工具

* BASE64文本编解码
* BASE64图片编解码
* URL编解码
* 进制转换

### 文本工具

* 正则表达式测试
* 文本差异对比

### 图形工具

* 二维码生成器
* 二维码识别
* 图片缩放
* ASCII Art生成器
* 渐变CSS生成器

### 加密工具

* HASH计算
* 强随机密码生成器

### 开发工具

* Unix时间戳转换
* User-Agent分析
* UUIDv4生成器
* SQL格式化工具

## 项目结构

```
app/
├── base-converter/          # 进制转换工具
├── base64-converter/        # BASE64编解码工具
├── gradient-generator/      # 渐变CSS生成器
├── image-base64-converter/  # BASE64图片编解码
├── image-resizer/          # 图片缩放工具
├── qr-generator/           # 二维码生成器
├── qr-scanner/             # 二维码识别
├── regex-tester/           # 正则表达式测试
├── text-diff/              # 文本差异对比
├── url-encoder-decoder/    # URL编解码
├── hash-calculator/        # HASH计算工具
├── password-generator/     # 强随机密码生成器
├── timestamp-converter/    # Unix时间戳转换
├── ascii-art-generator/    # ASCII Art生成器
├── user-agent-analyzer/    # User-Agent分析
├── uuid-generator/         # UUIDv4生成器
├── sql-formatter/          # SQL格式化工具
├── favicon.ico
├── globals.css
├── layout.tsx
└── page.tsx
```

## 开发环境搭建

1. 安装 Node.js (v22.0.0 或更高版本)
2. 安装项目依赖:
   ```bash
   npm install
   ```
3. 启动开发服务器:
   ```bash
   npm run dev
   ```
4. 访问 http://localhost:3000

## 部署

项目可以部署到任何支持 Next.js 的平台，如 Vercel、Netlify 等。

**免责声明**: 这个代码仓库完全由AI生成，旨在体验Vibe Coding模式，可能存在Bug，内容请仔细甄别。
