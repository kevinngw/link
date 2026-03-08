# 🚇 Link Pulse

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa)](https://web.dev/progressive-web-apps/)

> 西雅图 Link 轻轨实时脉动地图 | Realtime 1 Line & 2 Line train pulse map for Seattle

[Live Demo](https://your-demo-url.vercel.app) <!-- 如果有部署链接，请替换 -->

## ✨ 功能特性

- 📍 **实时列车追踪** - 通过 OneBusAway API 获取 1 LINE 和 2 LINE 的实时列车位置
- 🗺️ **可视化线路图** - SVG 绘制的直观线路图，显示列车在轨道上的实时位置
- 🧭 **方向与发车间隔** - 显示南北方向列车及发车间隔时间 (Headway)
- 📱 **PWA 支持** - 可安装为桌面/移动应用，离线可用
- 🖱️ **站点交互** - 点击站点查看即将到达的列车时刻
- ⚡ **轻量快速** - Vite 构建，快速加载与响应

## 🖼️ 预览

```
┌─────────────────────────────────────┐
│  LINK LIVE BOARD    [SYNC]          │
│  1 LINE / 2 LINE     Updated 5s ago │
├─────────────────────────────────────┤
│                                     │
│   ●───●───●───●───●───●───●        │
│   │   │   │   │   │   │   │        │
│  Lynnwood                         │
│   ◉ ← ▲ Train 156                 │
│   ●                               │
│  Roosevelt                        │
│   ●                               │
│  UW                               │
│   ●                               │
│  ...                              │
│                                     │
│  NB HEADWAY  8m  12m  15m          │
│  SB HEADWAY  6m  10m  14m          │
│                                     │
└─────────────────────────────────────┘
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装

```bash
# 克隆项目
git clone https://github.com/your-username/link-pulse.git
cd link-pulse

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:5173` 查看应用。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

## 🏗️ 项目结构

```
link-pulse/
├── public/               # 静态资源
│   ├── icon.svg         # 应用图标
│   └── link-data.json   # 线路数据
├── scripts/             # 构建脚本
│   └── build-link-data.mjs
├── src/
│   ├── main.js          # 主入口文件
│   └── style.css        # 样式文件
├── index.html           # HTML 模板
├── vite.config.js       # Vite 配置
└── package.json
```

## 🔌 数据来源

- **实时车辆数据**: [OneBusAway Puget Sound API](https://api.pugetsound.onebusaway.org/)
- **线路数据**: GTFS 格式，通过构建脚本处理

## 🛠️ 技术栈

- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) - PWA 支持
- Vanilla JavaScript - 原生 JavaScript，无框架依赖
- SVG - 矢量图形绘制线路图

## 📋 API 说明

本项目使用 OneBusAway API 获取实时数据：

```javascript
// 获取机构车辆信息
GET https://api.pugetsound.onebusaway.org/api/where/vehicles-for-agency/40.json

// 获取站点到达信息
GET https://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/{stopId}.json
```

> ⚠️ **注意**: 默认使用测试 API Key (`TEST`)，生产环境请申请正式 Key。

## 📝 配置

编辑 `src/main.js` 修改 API 配置：

```javascript
const VEHICLE_URL = 'https://api.pugetsound.onebusaway.org/api/where/vehicles-for-agency/40.json?key=YOUR_KEY'
const OBA_KEY = 'YOUR_KEY'
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

[MIT](LICENSE) © 2024

---

<p align="center">Made with ❤️ in Seattle</p>
