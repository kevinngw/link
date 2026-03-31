# Link Pulse

面向 Puget Sound 区域交通系统的实时 PWA 和 iOS 原生应用，集中展示 `Link`、`RapidRide` 和 `Swift` 的车辆位置、到站信息与运行健康度。

[在线演示](https://kevinngw.github.io/link/) &nbsp;|&nbsp; [English README](./README.md)

## 功能

- **多系统总览** — 在统一界面中切换 `Link`（轻轨）、`RapidRide`（King County Metro 快速公交）和 `Swift`（Community Transit 快速公交）
- **实时车辆追踪** — 自适应刷新，数据来自 Puget Sound OneBusAway API，使用公开 `TEST` key 时自动降频
- **四个视图** — `Map`（地图）、`Trains/Buses`（车辆列表）、`Favorites`（收藏站点）、`Insights`（运行洞察）
- **地图视图** — SVG 可视化，展示站点与实时车辆位置及运动轨迹
- **站点到站弹窗** — 点击任意站点查看未来 60 分钟的到站信息、服务摘要、告警及分享选项
- **到站屏模式** — 全屏站点视图，支持方向自动轮播，适合挂墙公共展示
- **站点搜索** — 按 `/` 可按名称、线路或系统搜索；支持基于定位的附近站点搜索
- **收藏站点** — 保存常用站点，快速访问
- **运行洞察面板** — 发车间隔健康度、晚点分布、关注标记及系统级健康汇总
- **双语 UI** — 中英文切换，语言偏好持久保存
- **主题切换** — 浅色 / 深色主题，带平滑过渡效果
- **PWA 支持** — 可安装至桌面或手机主屏幕，支持自动更新
- **iOS 原生应用** — 基于 Capacitor，支持本地通知、触觉反馈、原生地理位置和分享面板

## 技术栈

- [Vite](https://vitejs.dev/) + [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [Capacitor](https://capacitorjs.com/) 原生 iOS 支持
- 原生 JavaScript（ES 模块），SVG 渲染
- 等宽字体 UI（SF Mono / Roboto Mono / IBM Plex Mono）
- [Vitest](https://vitest.dev/) 单元测试

## 数据来源

| 数据 | 接口 |
|------|------|
| 实时车辆位置 | Puget Sound OneBusAway `vehicles-for-agency/{agencyId}.json` |
| 站点到站信息 | `arrivals-and-departures-for-stop/{stopId}.json` |
| 静态系统数据 | 由 [`scripts/build-link-data.mjs`](./scripts/build-link-data.mjs) 基于 Sound Transit GTFS、King County Metro GTFS、Community Transit GTFS 和 OBA 线路几何信息生成 |

> **说明：** 如果设置了 `VITE_OBA_KEY` 则优先使用，否则回退到公开测试 key `TEST`。使用 `TEST` 时，车辆轮询和到站缓存会自动放慢；遇到限流后，所有 OBA 请求共享冷却窗口，并使用带抖动的指数退避重试。生产部署建议配置正式 [OBA API key](https://developer.onebusaway.org/)。

## 本地开发

**环境要求：** Node.js `20.19+`（或 `22.12+`），npm 10+

```bash
# 可选：使用自己的 OneBusAway key，而非 TEST
cp .env.example .env.local
# 编辑 .env.local，设置 VITE_OBA_KEY=your_key

# 安装依赖并启动开发服务器
npm install
npm run dev
```

`predev` 脚本会自动拉取最新 GTFS 源数据并重新生成 `public/pulse-data.json`。该文件已加入 gitignore 作为本地构建产物，日常 `dev/build` 不会污染工作区。内容未实际变化时，生成脚本会跳过重写。

```bash
# 生产构建
VITE_OBA_KEY=your_key npm run build

# 或使用 .env.local / 部署平台环境变量
npm run build

# 本地预览生产构建
npm run preview
```

通过 GitHub Pages 部署时，请在仓库 `Settings > Secrets and variables > Actions` 中新增 `VITE_OBA_KEY` secret。若未配置，workflow 会自动回退到 `TEST`。

## iOS 开发

需要 Xcode 15+ 和 Apple Developer 账号（真机测试）。

```bash
# 构建并打开 Xcode
npm run ios

# 或分步执行：
npm run build:ios     # 使用 Capacitor 配置的 Vite 构建
npm run cap:sync      # 复制 web 资源到 Xcode 项目
npm run cap:open      # 打开 Xcode
```

iOS 构建使用 `VITE_CAPACITOR=true`，会禁用 PWA Service Worker 插件并将 base path 设为 `/`。Capacitor 的自定义 URL scheme（`LinkPulse://`）通过原生 HTTP 路由 fetch 请求，绕过浏览器 CORS 限制。

### 原生功能

以下 Capacitor 插件提供超越 PWA 能力的原生功能，满足 App Store 审核指南 4.2：

| 功能 | 插件 | 用途 |
|------|------|------|
| 本地通知 | `@capacitor/local-notifications` | 列车到站提醒 |
| 地理位置 | `@capacitor/geolocation` | 原生 iOS 权限流程，附近站点检测 |
| 触觉反馈 | `@capacitor/haptics` | 站点选择时振动反馈 |
| 分享面板 | `@capacitor/share` | 完整 iOS 分享集成 |
| 启动屏 | `@capacitor/splash-screen` | 数据加载后可控关闭 |

所有原生模块位于 `src/native/`，使用惰性动态导入，在 web 上自动降级为无操作。

### App Store 分发

1. 在 Xcode 的 Signing & Capabilities 中设置签名团队
2. 在 `Assets.xcassets` 中添加 1024x1024 应用图标（无透明度）
3. 设置 LaunchScreen.storyboard 背景色为 `#08141f`
4. Product > Archive > Distribute to App Store Connect

**Bundle ID:** `com.linkpulse.app` | **分类:** 旅行 / 导航 | **最低 iOS 版本:** 16.0

## 测试

```bash
npm test              # 监听模式
npm run test:run      # 单次运行
npm run test:ui       # 浏览器 UI 面板
npm run test:coverage # 覆盖率报告
```

## 项目结构

```
public/
  icon.svg              PWA 图标
  pulse-data.json       生成的多系统静态数据产物（已 gitignore）
scripts/
  build-link-data.mjs   交通数据生成脚本 — 拉取并转换 GTFS 与 OBA 数据
src/
  main.js               应用编排与状态接线
  config.js             系统元数据、UI 文案、刷新节奏配置
  static-data.js        静态数据加载与布局构建
  app-store.js          应用状态管理
  oba.js                OneBusAway API 客户端，含缓存与请求队列
  vehicles.js           车辆状态分类与解析
  arrivals.js           站点到站信息拉取与缓存
  insights.js           运行分析（间隔、晚点、健康标记）
  station-search.js     站点搜索，含定位支持
  favorites.js          收藏站点管理
  url-state.js          URL 参数同步
  vehicle-display.js    车辆 UI 渲染
  keyboard-nav.js       键盘快捷键处理
  virtual-scroll.js     虚拟列表渲染
  formatters.js         时间/日期格式化工具
  toast.js              Toast 通知
  error-boundary.js     错误处理
  utils.js              公共工具函数
  native/               Capacitor 原生模块
    platform.js         平台检测（web vs iOS）
    notifications.js    本地推送通知
    geolocation.js      原生地理位置（含 web 回退）
    haptics.js          触觉反馈
    splash.js           启动屏控制
    share.js            原生分享（含 web 回退）
  renderers/            地图、车辆列表、洞察视图渲染器
  dialogs/              站点到站、告警、洞察详情弹窗
  style.css             全局样式（约 4300 行）
ios/                    Xcode 项目（Capacitor 生成）
capacitor.config.json   Capacitor 配置
.github/workflows/
  deploy.yml            GitHub Pages CI/CD 配置
index.html
vite.config.js
vitest.config.js
```

## 部署

通过 [`deploy.yml`](./.github/workflows/deploy.yml) 自动部署至 GitHub Pages。推送到 `main` 或 `dev` 时触发构建和发布。

| 分支 | 地址 |
|------|------|
| `main` | https://kevinngw.github.io/link/ |
| `dev`  | https://kevinngw.github.io/link/dev/ |

`main` 发布到站点根目录，存在时保留 `dev/` 预览目录；`dev` 发布到 `/link/dev/`。每次构建前按分支设置 `VITE_BASE`，确保静态资源和 PWA manifest 路径正确。
