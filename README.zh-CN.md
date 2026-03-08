# Link Pulse

西雅图 Link 轻轨实时脉动地图，聚焦 1 Line 和 2 Line 的实时列车位置、方向、终点 headway 与站点到站信息。

[在线演示](https://kevinngw.github.io/link/)

英文说明请见：[README.md](./README.md)

## 功能

- 实时列车追踪，数据来自 Puget Sound OneBusAway
- 黑底 LED 风格线路图
- `Map / Trains / Times` 三个视图
- 站点弹窗，显示混合排序的到站时间
- 共线车站同时显示 1 Line 和 2 Line 到站信息
- PWA 支持，可安装到桌面或手机

## 本地开发

环境要求：

- Node.js 18+
- npm 9+

安装并启动：

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
```

## 数据来源

- 实时车辆：`vehicles-for-agency/40.json`
- 站点到站：`arrivals-and-departures-for-stop/{stopId}.json`
- 静态线路：Sound Transit GTFS rail feed，经 `scripts/build-link-data.mjs` 处理

说明：

- 当前默认使用测试 key `TEST`
- 遇到限流时，前端会做 backoff retry
- 生产部署建议换成正式 OBA key

## 项目结构

```text
public/
  icon.svg
  link-data.json
scripts/
  build-link-data.mjs
src/
  main.js
  style.css
.github/workflows/
  deploy.yml
vite.config.js
```
