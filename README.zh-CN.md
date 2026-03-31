# Link Pulse

西雅图轻轨实时追踪应用。支持 PWA 和 iOS 原生应用。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tests](https://img.shields.io/badge/tests-vitest-green.svg)
![Platform](https://img.shields.io/badge/platform-web%20%7C%20iOS-blue.svg)

## 功能特性

### 实时交通数据
- 列车和公交车实时位置与到站时间
- 多系统支持：Link 轻轨、RapidRide、Swift
- 站点到达预测与延误指示
- 服务警报和中断通知

### 性能优化
- **Stale-while-revalidate 缓存** — 立即返回数据，后台刷新
- **自适应并发** — 根据成功率自动调整 1-6 个并行请求
- **请求去重** — 相同端点共享进行中的请求
- **虚拟滚动** — 大数据列表保持 60fps
- **悬停预加载** — 鼠标悬停 100ms 后预加载站点数据

### 弹性请求处理
- AbortController 支持请求取消
- FIFO 队列 + 指数退避重试
- 全局错误边界，优雅降级
- Web Vitals 监控（LCP、CLS、FID）

### 键盘导航
Vim 风格快捷键：

| 按键 | 操作 |
|-----|------|
| `j` / `k` | 下一项 / 上一项 |
| `h` / `l` | 上一个标签 / 下一个标签 |
| `1` `2` `3` | 地图 / 列车 / 洞察 |
| `/` | 搜索站点 |
| `r` | 刷新数据 |
| `Space` | 切换显示模式 |
| `Esc` | 关闭对话框 |

### iOS 原生功能
- 本地推送通知 — 列车到站提醒
- 原生地理位置 — 附近站点检测
- 触觉反馈 — 交互振动反馈
- 原生分享面板
- 启动屏平滑过渡

### 无障碍
- 跳转到内容链接
- ARIA 实时区域播报
- 对话框焦点捕获
- 完整键盘导航支持

## 快速开始

### 环境要求
- Node.js 18+
- npm
- Xcode 15+（iOS 构建需要）

### 安装
```bash
git clone https://github.com/kevinngw/link.git
cd link
npm install
```

### Web 开发
```bash
npm run dev
# 打开 http://localhost:5173/link/
```

### iOS 开发
```bash
npm run ios
# 打开 Xcode — 选择模拟器或真机，点击运行
```

### 生产构建
```bash
# Web (PWA)
npm run build

# iOS
npm run build:ios
npm run cap:sync
```

### 运行测试
```bash
npm test             # 监听模式
npm run test:run     # 单次运行
npm run test:ui      # 交互式 UI
npm run test:coverage
```

## 架构

### 双构建系统

项目从同一代码库支持两个构建目标：

| 目标 | 基础路径 | PWA | Service Worker | 原生插件 |
|------|---------|-----|----------------|---------|
| Web | `/link/` | 是 | 是 | 否 |
| iOS (Capacitor) | `/` | 否 | 存根 | 是 |

设置 `VITE_CAPACITOR=true` 启用 iOS 构建。PWA 插件替换为空操作存根，Capacitor 的原生 HTTP 层处理 API 请求（绕过 CORS）。

### 项目结构

```
src/
├── main.js              # 应用入口
├── store.js             # 响应式存储（基于 Proxy）
├── app-store.js         # 应用状态和 actions
├── config.js            # API 配置、缓存 TTL、国际化字符串
├── oba.js               # OneBusAway API 客户端（SWR、去重、重试）
├── arrivals.js          # 到站数据处理
├── error-boundary.js    # 错误处理和 Web Vitals
├── keyboard-nav.js      # 键盘快捷键系统
├── virtual-scroll.js    # 虚拟滚动
├── formatters.js        # 日期、时间、数字格式化
├── insights.js          # 交通数据分析
├── vehicles.js          # 车辆状态解析
├── static-data.js       # 静态数据加载
├── utils.js             # 工具函数
├── native/              # Capacitor 原生模块
│   ├── platform.js      # 平台检测（web vs iOS）
│   ├── notifications.js # 本地推送通知
│   ├── geolocation.js   # 原生地理位置（含 web 回退）
│   ├── haptics.js       # 触觉反馈
│   ├── splash.js        # 启动屏控制
│   └── share.js         # 原生分享（含 web 回退）
├── renderers/
│   ├── map.js           # 地图视图
│   ├── trains.js        # 列车列表视图
│   └── insights.js      # 数据分析面板
├── dialogs/
│   ├── dom.js           # 对话框 DOM 结构
│   ├── overlays.js      # 覆盖层管理
│   ├── station-display.js
│   └── station-render.js
└── *.test.js            # 单元测试

ios/                     # Xcode 项目（Capacitor 生成）
capacitor.config.json    # Capacitor 配置
```

### 请求流程
```
用户操作 → Store → OBA 客户端 → 队列 → fetch()
                      ↓            ↓
                   去重检查     重试（指数退避）
                      ↓            ↓
                   SWR 缓存    AbortController
```

### 原生模块模式

所有原生模块使用惰性动态导入，在 web 上自动降级：

```javascript
import { isNative } from './native/platform'

// 原生地理位置，自动回退到 web
const position = await getCurrentPosition()

// 触觉反馈 — web 上无操作，iOS 上振动
await lightImpact()

// 通知 — 仅原生环境可用
await scheduleArrivalAlert('Capitol Hill', '1 Line', 3)
```

## 配置

### 环境变量
```bash
# .env.local
VITE_OBA_KEY=your_api_key_here    # OneBusAway API 密钥
VITE_CAPACITOR=true               # 启用 iOS 构建模式
VITE_BASE=/link/                  # 基础路径（仅 web）
```

没有 `VITE_OBA_KEY` 时，使用公共 `TEST` 密钥（有速率限制）。

### 缓存配置

编辑 `src/config.js` 调整时间参数：

```javascript
// 生产配置（有 API 密钥）
ARRIVALS_CACHE_TTL_MS: 60_000     // 1 分钟
OBA_CACHE_TTL_MS: 60_000
MAX_CONCURRENT_REQUESTS: 3
COOLDOWN_BASE_MS: 10_000

// 测试配置（公共密钥）
ARRIVALS_CACHE_TTL_MS: 120_000    // 2 分钟
MAX_CONCURRENT_REQUESTS: 1
COOLDOWN_BASE_MS: 30_000
```

## iOS App Store

### 分发构建
1. 运行 `npm run ios` 打开 Xcode
2. 在 Signing & Capabilities 中设置签名团队
3. 在 `Assets.xcassets` 中添加 1024x1024 应用图标（无透明度）
4. 设置 LaunchScreen.storyboard 背景色为 `#08141f`
5. Product > Archive > Distribute to App Store Connect

### 审核合规原生功能
应用包含五项超越 web 能力的原生集成：
- **本地通知** — 列车到站提醒
- **原生地理位置** — iOS 权限流程
- **触觉反馈** — 站点选择时振动
- **原生分享面板** — 完整 iOS 分享集成
- **启动屏** — 可控的关闭时机

### App Store 元数据
- **Bundle ID**: `com.linkpulse.app`
- **分类**: 旅行 / 导航
- **最低 iOS 版本**: 16.0
- **隐私**: 位置仅用于查找附近站点；偏好设置本地存储；不收集个人数据

## 浏览器支持

| 浏览器 | 版本 |
|--------|------|
| Chrome / Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |

需要：ES2020+、IntersectionObserver、ResizeObserver、AbortController

## 贡献指南

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 运行测试 (`npm test`)
4. 提交更改
5. 创建 Pull Request

## 许可证

MIT 许可证 - 详见 LICENSE 文件

## 致谢

- 交通数据来自 [OneBusAway](https://onebusaway.org/) API
- 服务数据来自 Sound Transit、King County Metro 和 Community Transit
