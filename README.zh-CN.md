# Link Pulse

面向 Puget Sound 区域交通系统的实时交通脉搏看板，当前同时支持 Web 应用和基于 Capacitor 的 iOS App 壳。

[在线演示](https://kevinngw.github.io/link/) | [English README](./README.md)

## 相对 `dev` 的变化

相对于当前 `dev` 分支的 tip，这个分支主要加入了第一版 iOS 打包能力，并同步调整了本地开发流程：

- **Capacitor iOS 壳** — 新增 [`ios/`](./ios) 原生工程，并通过 [`capacitor.config.json`](./capacitor.config.json) 配置 `LinkPulse`
- **构建流程拆分** — GTFS 刷新改为显式命令，Web / Native 构建分开执行
- **原生兼容适配层** — 存储、定位、分享统一走 [`src/native/`](./src/native)，同一套业务代码可同时运行在 Web 和 Capacitor 中
- **Service Worker 只在 Web 注册** — PWA 行为保留在 Web 构建，原生壳内不再注册
- **iPhone UI 微调** — 针对模拟器上的 header、dialog、地图标签和窄屏布局做了收紧
- **iOS 上架准备文档** — 实施说明和 App Store 审核注意事项写在 [`docs/ios-app-store-readiness.md`](./docs/ios-app-store-readiness.md)

## 功能

- **多系统总览** — 在同一套壳中切换 `Link`、`RapidRide` 和 `Swift`
- **实时到站与车辆** — 基于 OneBusAway 提供实时车辆位置、到站信息和服务状态
- **四个核心视图** — `Map`、`Trains/Buses`、`Favorites`、`Insights`
- **站点到站弹窗** — 在一个站点弹窗内查看到站、告警、展示模式、收藏和分享
- **列车运行详情弹窗** — 展示前序/当前/下一站、当前区间和终点 ETA
- **站点搜索** — 支持按名称、线路和附近站点搜索，Web 与 Native 都可用
- **偏好持久化** — 主题、语言、收藏和最近搜索都会保留
- **双语 UI** — 英文 / 简体中文
- **Web 端 PWA** — Web 构建仍支持安装和 Service Worker

## 技术栈

- [Vite](https://vitejs.dev/) + [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- 原生 JavaScript（ES 模块）+ SVG 渲染
- [Capacitor](https://capacitorjs.com/) 负责 iOS 打包
- Capacitor 插件：`Preferences`、`Geolocation`、`Share`、`Clipboard`
- [Vitest](https://vitest.dev/) 单元测试

## 环境要求

- Node.js `20.19+` 或 `22.12+`
- npm `10+`
- 做 iOS 模拟器 / 真机调试时需要 Xcode

## 快速开始

```bash
npm install

# 可选：使用自己的 OneBusAway key，而不是 TEST
cp .env.example .env.local
# 编辑 .env.local，设置 VITE_OBA_KEY=your_key
```

## 数据刷新与构建流程

这个分支不再在每次 `dev` 或 `build` 时自动刷新 GTFS 数据，静态交通数据刷新现在改为显式执行：

```bash
# 拉取最新 GTFS / OBA 衍生静态数据
npm run refresh:data
```

只有你确实想更新源数据时才需要执行它。日常的 Web / Native 构建现在都不再强依赖一次在线刷新。

## Web 开发

```bash
# 直接启动本地 Web 开发，使用当前已有静态数据
npm run dev

# 先刷新静态数据，再启动 Vite
npm run dev:refresh

# Web 生产构建
npm run build:web

# build 现在是 build:web 的别名
npm run build

# 本地预览 Web 生产包
npm run preview
```

## iOS 开发

```bash
# 为原生壳构建 Web 资源
npm run build:native

# 构建原生资源并同步到 ios/
npm run cap:sync

# 打开 Xcode 工程
npm run ios:open
```

Capacitor 配置在 [`capacitor.config.json`](./capacitor.config.json)，生成的 Xcode 工程在 [`ios/App/App.xcodeproj`](./ios/App/App.xcodeproj/project.pbxproj)。

模拟器 / 真机调试的典型循环是：

1. `npm run cap:sync`
2. `npm run ios:open` 打开 Xcode
3. 运行 `LinkPulse` scheme 到模拟器或设备

## 环境变量

| 变量 | 作用 |
|---|---|
| `VITE_OBA_KEY` | OneBusAway API key。未设置时回退到公开 `TEST`。 |
| `VITE_TARGET` | 构建目标选择器，由脚本传入 `web` 或 `native`。 |
| `VITE_BASE` | 特殊部署场景下可手动覆盖 base 路径。 |
| `VITE_SHARE_BASE_URL` | 生成站点分享链接时使用的基础 URL。 |

> 使用公开 `TEST` key 时，应用仍然可以工作，但刷新会更保守，遇到限流时退避也会更激进。

## 测试

```bash
npm test
npm run test:run
npm run test:ui
npm run test:coverage
```

## 数据来源

| 数据 | 接口 |
|---|---|
| 实时车辆位置 | Puget Sound OneBusAway `vehicles-for-agency/{agencyId}.json` |
| 站点到站信息 | `arrivals-and-departures-for-stop/{stopId}.json` |
| 静态系统数据 | 由 [`scripts/build-link-data.mjs`](./scripts/build-link-data.mjs) 基于 Sound Transit GTFS、King County Metro GTFS、Community Transit GTFS 和 OBA 线路几何信息生成 |

## 项目结构

```text
docs/
  ios-app-store-readiness.md   iOS 落地与 App Store 审核准备文档
ios/
  App/                         Capacitor iOS 工程
public/
  icon.svg                     PWA 图标
  pulse-data.json              生成的静态交通数据产物
scripts/
  build-link-data.mjs          GTFS / OBA 静态数据生成脚本
src/
  native/                      Web / Native 平台、存储、分享、定位适配层
  dialogs/                     站点、列车、告警弹窗渲染
  renderers/                   地图、车辆列表、洞察视图渲染器
  main.js                      应用外壳与 UI 接线
  static-data.js               静态数据加载与初始化
  station-search.js            搜索与附近站点查找
  favorites.js                 收藏站点管理
  recent-stations.js           最近站点会话状态
  style.css                    全局 UI 样式
capacitor.config.json          Capacitor 应用配置
vite.config.js                 Web / Native Vite 构建配置
```

## 部署

Web 部署仍然通过 [`deploy.yml`](./.github/workflows/deploy.yml) 发布到 GitHub Pages。

| 分支 | 地址 |
|---|---|
| `main` | https://kevinngw.github.io/link/ |
| `dev` | https://kevinngw.github.io/link/dev/ |

`main` 发布到站点根目录，并在存在时保留 `dev/` 预览目录；`dev` 发布到 `/link/dev/`。
