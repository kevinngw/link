# Link Pulse

面向 Puget Sound 区域交通系统的实时交通看板，当前同时支持可安装的 Web App 和基于 Capacitor 的 iOS App。

[在线演示](https://kevinngw.github.io/link/) | [English README](./README.md)

## 项目概览

Link Pulse 当前覆盖这几个系统：

- `Link` 轻轨
- `RapidRide` BRT
- `Swift` BRT

整个项目保持一套共享的 JavaScript UI，并以两种形态发布：

- 面向 GitHub Pages 的 PWA Web 版
- 通过 Capacitor 打包的 iOS App

## 主要能力

- **多系统总览**，包含 `Map`、`Trains/Buses`、`Favorites`、`Insights`
- **实时到站和车辆位置**，数据来自 Puget Sound OneBusAway
- **站点弹窗**，支持查看到站、告警、收藏、分享和到站屏展示模式
- **列车详情弹窗**，展示前序/当前/下一站和终点 ETA
- **站点搜索**，支持按站名、线路、系统和附近站点查找
- **偏好持久化**，保存主题、语言、收藏和最近搜索
- **双语 UI**，支持英文和简体中文
- **iPhone 适配**，已经针对弹窗、到站屏模式、地图标签、图标和 splash 做过优化

## 技术栈

- [Vite](https://vitejs.dev/) + [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- 原生 JavaScript（ES 模块）+ SVG 渲染
- [Capacitor](https://capacitorjs.com/) 负责 iOS 打包
- Capacitor 插件：
  - `Preferences`
  - `Geolocation`
  - `Share`
  - `Clipboard`
  - `Haptics`
  - `Splash Screen`
- [Vitest](https://vitest.dev/) 单元测试

## 环境要求

- Node.js `20.19+` 或 `22.12+`
- npm `10+`
- 做 iOS 模拟器或真机调试时需要 Xcode

## 快速开始

```bash
npm install

# 可选：使用自己的 OneBusAway key，而不是 TEST
cp .env.example .env.local
# 编辑 .env.local，设置 VITE_OBA_KEY=your_key
```

GTFS 衍生静态数据刷新现在是显式命令：

```bash
npm run refresh:data
```

只有在你想更新源数据时才需要执行它。日常的 Web 和 iOS 构建不会强制先在线拉一次 GTFS。

## 常用命令

```bash
# Web 开发
npm run dev
npm run dev:refresh

# 生产构建
npm run build
npm run build:web
npm run build:native

# iOS 同步 / 打开 Xcode
npm run cap:sync
npm run ios:open

# 本地预览
npm run preview

# 测试
npm test
npm run test:run
npm run test:ui
npm run test:coverage
```

## Web 开发

`npm run dev` 会启动 Vite 开发服务器。这个项目在 Web 侧运行在 `/link/` 路径下，所以本地一般从这里打开：

- `http://localhost:5173/link/`

`npm run build:web` 会生成 PWA 版本：

- 开启 service worker
- 使用 GitHub Pages 的 `/link/` base path

## iOS 开发

当前 iOS App 的标识是：

- App 名称：`Link Pulse`
- Bundle ID：`com.linkpulse.app`
- Scheme：`LinkPulse`

相关文件：

- Capacitor 配置：[capacitor.config.json](./capacitor.config.json)
- Xcode 工程：[ios/App/App.xcodeproj](./ios/App/App.xcodeproj/project.pbxproj)
- App 源码和资源：[ios/App/LinkPulse/](./ios/App/LinkPulse)

模拟器 / 真机开发的典型流程：

```bash
# 为原生壳构建 Web 资源并同步到 ios/
npm run cap:sync

# 打开 Xcode
npm run ios:open
```

`npm run build:native` 和 Web 构建有两个关键区别：

- base path 会切换成 `/`
- 会禁用 PWA 注册，避免原生壳里再带 service worker

原生适配层都在 [`src/native/`](./src/native)：

- [`src/native/platform.js`](./src/native/platform.js)
- [`src/native/storage.js`](./src/native/storage.js)
- [`src/native/location.js`](./src/native/location.js)
- [`src/native/share.js`](./src/native/share.js)
- [`src/native/haptics.js`](./src/native/haptics.js)
- [`src/native/splash.js`](./src/native/splash.js)

## 环境变量

| 变量 | 作用 |
| --- | --- |
| `VITE_OBA_KEY` | OneBusAway API key。未设置时回退到公开 `TEST`。 |
| `VITE_TARGET` | 构建目标选择器，由脚本传入 `web` 或 `native`。 |
| `VITE_BASE` | 特殊部署场景下手动覆盖基础路径。 |
| `VITE_SHARE_BASE_URL` | 生成站点分享链接时使用的基础 URL。 |

> 使用公开 `TEST` key 时，应用仍然可以工作，但刷新会更保守，限流后的退避也会更激进。

## 数据来源

| 数据 | 接口 |
| --- | --- |
| 实时车辆位置 | Puget Sound OneBusAway `vehicles-for-agency/{agencyId}.json` |
| 站点到站信息 | `arrivals-and-departures-for-stop/{stopId}.json` |
| 静态系统数据 | 由 [`scripts/build-link-data.mjs`](./scripts/build-link-data.mjs) 基于 GTFS 和 OBA 几何数据生成 |

## 项目结构

```text
docs/
  ios-app-store-readiness.md   iOS 落地与 App Store 审核说明
ios/
  App/
    App.xcodeproj/             Xcode 工程
    CapApp-SPM/                Capacitor Swift Package 桥接层
    LinkPulse/                 App 源码、资源、plist、隐私清单
public/
  icon.svg                     Web 图标源文件
  splash-light.svg             浅色 splash 源文件
  splash-dark.svg              深色 splash 源文件
  pulse-data.json              生成的静态交通数据产物
scripts/
  build-link-data.mjs          GTFS / OBA 静态数据生成脚本
src/
  dialogs/                     站点、列车、告警和 overlay 弹窗逻辑
  native/                      Web / Native 适配层
  renderers/                   地图、车辆列表、洞察视图渲染器
  main.js                      应用外壳与 UI 接线
  static-data.js               静态数据加载与初始化
  station-search.js            搜索与附近站点查找
  favorites.js                 收藏站点管理
  recent-stations.js           最近站点会话状态
  style.css                    全局样式
capacitor.config.json          Capacitor 应用配置
vite.config.js                 Web / Native Vite 构建配置
```

## 部署

Web 版本通过 [`deploy.yml`](./.github/workflows/deploy.yml) 发布到 GitHub Pages。

| 分支 | 地址 |
| --- | --- |
| `main` | https://kevinngw.github.io/link/ |
| `dev` | https://kevinngw.github.io/link/dev/ |

## App Store 备注

仓库里已经包含 iOS 打包的基础准备：

- 基于 Capacitor 的原生 app shell
- iOS app icon 和 splash 资源
- `PrivacyInfo.xcprivacy`
- `Info.plist` 里的定位权限文案
- 原生安全的存储、定位、分享、触感反馈和 splash 处理

更完整的实现和审核说明见 [`docs/ios-app-store-readiness.md`](./docs/ios-app-store-readiness.md)。
