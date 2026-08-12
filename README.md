# 太虚问道 · 修仙决

青云宗背景的卡牌式修仙游戏。玩家每次通过左右拖动卡牌做出选择，或向上滑进行半年闭关；选择会影响属性、寿元、人物好感、因果线索和后续主线。

## 本地运行

在项目根目录启动静态服务器：

```powershell
python -m http.server 8877 --bind 127.0.0.1
```

然后打开 `http://127.0.0.1:8877/`。

## 项目目录

- `index.html`：页面入口和静态容器。
- `src/app.js`：游戏状态、事件循环、卡牌选择、渲染和存档。
- `config/story-config.js`：剧情扩展配置入口，适合增加人物好感规则和人际联动。
- `styles/base.css`：基础视觉样式。
- `styles/visual-polish.css`：卡牌浮动、焦点提示、移动端细节和减少动态效果适配。
- `styles/ui-overrides.css`：游戏专属 UI、背景、动效和响应式样式。
- `assets/backgrounds/`：主界面和第一幕背景。
- `assets/artifacts/`：法宝、道具封面和图标资源。
- `docs/`：设计文档、系统规划和后续开发约定。
- `tests/`：回归清单、资源冒烟检查和剧情配置校验。

## 剧情扩展接口

页面加载后可通过 `window.QingyunStoryAPI` 调整运行时规则；长期剧情配置优先写入 `config/story-config.js`，避免直接修改核心循环。调试剧情时可调用 `QingyunStoryAPI.diagnostics()` 查看当前章节、寿元、境界、法宝和好感度。

新增法宝时，在 `config/story-config.js` 的 `artifacts` 中配置名称、图标、封面和提示文本；剧情或调试接口调用 `QingyunStoryAPI.grantArtifact('法宝ID')` 后，法宝会自动进入左侧栏位。栏位按实际数量增长并支持滚动查看。当前存档格式为第 4 版，旧存档会自动迁移。

配置中的 `moonLamp` 是一个不会自动发放的示例，可用 `QingyunStoryAPI.grantArtifact('moonLamp')` 测试法宝栏位和属性效果。

剧情奖励可在 `artifactRewards` 中按“卡牌类型 + left/right”配置，例如 `{ '古洞机缘': { right: 'moonLamp' } }`；玩家选择该方向时会自动获得法宝。
