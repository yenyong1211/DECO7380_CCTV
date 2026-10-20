# CCTV prototype — History

根据 7380history Figma 实现的可运行前端。入口是 `prototype/index.html`，手机与电脑浏览器均可使用，无需安装依赖或构建。

## 本地运行

在仓库根目录运行 `python3 -m http.server 7380`，打开 http://localhost:7380/prototype/ 。手机连接同一 Wi-Fi 后，将 localhost 替换为电脑的局域网 IP。也可直接打开 index.html 的静态托管地址；ES modules 需要 HTTP 服务，不能使用 file://。

## 当前实现

- 最近 7 天日期切换、每日人数与访问次数统计、无记录状态。
- Alex、Emma、James 的访问记录；可折叠 live video / recording 明细。
- Emma 与 James 独立权限页面，四个可见范围选项与实时插画预览。
- 权限使用 localStorage 按人保存；刷新后保留，浏览器禁止存储时仍可在当前会话使用。
- 支持浏览器返回、键盘操作、小屏幕、辅助标签与 reduced motion。

这是交互演示，不连接真实摄像头、视频处理或身份认证。访问记录固定在 2026 年 10 月 13–19 日以匹配设计。除 19 日截图可见内容外的事件和 James 权限默认值为演示补充，需要后续确认。切换权限不修改历史记录。

## 后续组员合并

每个功能放在 `prototype/<feature>/`，保留 history 的三个文件，避免多人编辑同一个模块。应用入口目前直接显示 history，可在入口增加导航并使用 `#history`、`#history/permissions/emma`、`#history/permissions/james`。

- `history/data.js`：成员、日期与访问数据适配层；后续替换为 API 数据。
- `history/history.js`：history 与权限交互；权限变化会派发 `cctv:permission-change` CustomEvent，detail 为 `{ personId, camera, mode }`。
- `history/history.css`：当前页面样式；合并全局应用时应为样式加模块范围。

不要将真实摄像头密钥写入前端。真实权限执行必须在后端实现，当前的本机设置只用于演示。

## GitHub Pages

如果仓库尚未启用 Pages：Settings → Pages → Deploy from a branch → main → /(root)。部署后入口为 https://yenyong1211.github.io/DECO7380_CCTV/prototype/ 。此地址只有启用并成功部署后才可访问。
