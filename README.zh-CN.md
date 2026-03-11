# 🚇 Link Pulse

西雅图 Link 轻轨实时追踪 PWA，聚焦 `1 Line` 和 `2 Line` 的列车位置、到站时间与运行频率。

[🌐 在线演示](https://kevinngw.github.io/link/) &nbsp;|&nbsp; [English README](./README.md)

## ✨ 功能

- **实时列车追踪** — 自适应刷新，数据来自 Puget Sound OneBusAway API，公开 `TEST` key 下会自动降频
- **LED 风格线路图** — 黑底霓虹显示屏，带动态列车指示灯
- **三个视图** — `Map`（地图）、`Trains`（列车列表）、`Times`（发车间隔）
- **站点到站弹窗** — 点击任意站点，查看南北两向各 4 班次到站时间
- **共线站点合并显示** — 同时运营 1 Line 和 2 Line 的站点统一展示到站信息
- **运行状态标识** — `OK`（正常）、`DELAY`（晚点 ≥ 2 分钟）、`ARR`（即将到站）
- **PWA 支持** — 可安装至桌面或手机主屏幕

## 🛠 技术栈

- [Vite](https://vitejs.dev/) + [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- 原生 JavaScript，SVG 渲染
- 等宽字体 UI（SF Mono / Roboto Mono / IBM Plex Mono）

## 📡 数据来源

| 数据 | 接口 |
|------|------|
| 实时车辆位置 | Puget Sound OneBusAway `vehicles-for-agency/40.json` |
| 站点到站信息 | `arrivals-and-departures-for-stop/{stopId}.json` |
| 静态线路数据 | Sound Transit GTFS rail feed，经 [`scripts/build-link-data.mjs`](./scripts/build-link-data.mjs) 处理生成 |

> **说明：** 如果设置了 `VITE_OBA_KEY` 就优先使用该值，否则默认回退到公开测试 key `TEST`。使用 `TEST` 时，车辆轮询、站点弹窗自动刷新和到站缓存都会自动放慢；一旦遇到限流，所有 OBA 请求会共享冷却窗口，并使用带抖动的指数退避重试。生产部署建议配置正式 [OBA API key](https://developer.onebusaway.org/)。

## 🚀 本地开发

**环境要求：** Node.js 18+，npm 9+

```bash
# 可选：使用你自己的 OneBusAway key，而不是 TEST
cp .env.example .env.local
# 编辑 .env.local，设置 VITE_OBA_KEY=your_key

# 安装依赖并启动开发服务器
npm install
npm run dev
```

`predev` 脚本会自动拉取最新的 Sound Transit GTFS 数据并重新生成 `public/pulse-data.json`。
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
  pulse-data.json       生成的静态线路数据
scripts/
  build-link-data.mjs   GTFS 处理脚本 — 拉取并转换 Sound Transit 数据
src/
  main.js               应用编排 / 入口接线
  static-data.js        静态数据与启动辅助逻辑
  style.css             样式（约 620 行）
.github/workflows/
  deploy.yml            GitHub Pages CI/CD 配置
index.html
vite.config.js
```

## ⚙️ 部署

通过 [`deploy.yml`](./.github/workflows/deploy.yml) 配置自动部署至 GitHub Pages。推送到任意已跟踪的分支，均会构建并部署到 `gh-pages` 分支下对应的子路径。

| 分支 | 地址 |
|------|------|
| `main` | https://kevinngw.github.io/link/ |
| `dev` | https://kevinngw.github.io/link/dev/ |

每个分支构建前会将 `VITE_BASE` 设置为对应子路径，确保静态资源和 PWA manifest 路径正确。
