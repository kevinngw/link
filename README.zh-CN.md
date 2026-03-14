# 🚇 Link Pulse

面向 Puget Sound 区域交通系统的实时 PWA，集中展示 `Link`、`RapidRide` 和 `Swift` 的车辆位置、到站信息与运行健康度。

[🌐 在线演示](https://kevinngw.github.io/link/) &nbsp;|&nbsp; [English README](./README.md)

## ✨ 功能

- **多系统总览** — 在统一界面中切换 `Link`、`RapidRide` 和 `Swift`
- **实时车辆追踪** — 自适应刷新，数据来自 Puget Sound OneBusAway API，公开 `TEST` key 下会自动降频
- **四个视图** — `Map`（地图）、`Trains/Buses`（车辆列表，按系统自适应）、`Favorites`（收藏站点）、`Insights`（运行洞察）
- **站点到站弹窗** — 点击任意站点可查看到站信息、服务摘要、告警
- **到站屏模式** — 全屏站点视图，支持方向自动轮播，适合挂墙展示
- **站点搜索** — 按 `/` 或点击搜索按钮，快速跳转到任意已加载站点；支持基于定位的附近站点搜索
- **收藏站点** — 保存常用站点，快速访问
- **运行洞察面板** — 汇总发车间隔、晚点分布、关注线路和系统级健康指标
- **双语与主题切换** — 支持中英文切换，以及浅色 / 深色主题
- **PWA 支持** — 可安装至桌面或手机主屏幕

## 🛠 技术栈

- [Vite](https://vitejs.dev/) + [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- 原生 JavaScript，SVG 渲染
- 等宽字体 UI（SF Mono / Roboto Mono / IBM Plex Mono）

## 📡 数据来源

| 数据 | 接口 |
|------|------|
| 实时车辆位置 | Puget Sound OneBusAway `vehicles-for-agency/{agencyId}.json` |
| 站点到站信息 | `arrivals-and-departures-for-stop/{stopId}.json` |
| 静态系统数据 | 由 [`scripts/build-link-data.mjs`](./scripts/build-link-data.mjs) 基于 Sound Transit rail GTFS、King County Metro GTFS、Community Transit GTFS 和 OBA 线路几何信息生成 |

> **说明：** 如果设置了 `VITE_OBA_KEY` 就优先使用该值，否则默认回退到公开测试 key `TEST`。使用 `TEST` 时，车辆轮询、站点弹窗自动刷新和到站缓存都会自动放慢；一旦遇到限流，所有 OBA 请求会共享冷却窗口，并使用带抖动的指数退避重试。生产部署建议配置正式 [OBA API key](https://developer.onebusaway.org/)。

## 🚀 本地开发

**环境要求：** Node.js `20.19+`（或 `22.12+`），npm 10+

```bash
# 可选：使用你自己的 OneBusAway key，而不是 TEST
cp .env.example .env.local
# 编辑 .env.local，设置 VITE_OBA_KEY=your_key

# 安装依赖并启动开发服务器
npm install
npm run dev
```

`predev` 脚本会自动拉取最新的交通源数据并重新生成 `public/pulse-data.json`。
该文件现在被视为本地构建产物（已加入 gitignore），所以日常 `dev/build` 不会再把工作区弄脏。
生成脚本在内容未实际变化时也会跳过重写。

```bash
# 生产构建
VITE_OBA_KEY=your_key npm run build

# 或者使用 .env.local / 部署平台环境变量
npm run build

# 本地预览生产构建
npm run preview
```

如果通过 GitHub Pages 部署，请在仓库 `Settings -> Secrets and variables -> Actions` 中新增 `VITE_OBA_KEY` 这个 repository secret。若未配置，workflow 会自动回退到 `TEST`。

## 📁 项目结构

```
public/
  icon.svg              PWA 图标
  pulse-data.json       生成的多系统静态数据产物
scripts/
  build-link-data.mjs   交通数据生成脚本 — 拉取并转换 GTFS 与 OBA 参考数据
src/
  main.js               应用编排 / 入口接线
  static-data.js        静态数据与启动辅助逻辑
  config.js             系统元数据、文案与刷新节奏
  renderers/            地图 / 车辆 / 洞察视图
  dialogs/              站点、告警与洞察详情弹窗
  style.css             样式（约 3100 行）
.github/workflows/
  deploy.yml            GitHub Pages CI/CD 配置
index.html
vite.config.js
```

## ⚙️ 部署

通过 [`deploy.yml`](./.github/workflows/deploy.yml) 配置自动部署至 GitHub Pages。推送到 `main` 和 `dev` 时会自动构建并发布。

| 分支 | 地址 |
|------|------|
| `main` | https://kevinngw.github.io/link/ |
| `dev` | https://kevinngw.github.io/link/dev/ |

`main` 会发布到站点根目录，并在存在时保留已有的 `dev/` 预览目录；`dev` 会发布到 `/link/dev/`。每次构建前都会按分支设置 `VITE_BASE`，确保静态资源和 PWA manifest 路径正确。
