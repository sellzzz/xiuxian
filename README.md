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

新增法宝时，在 `config/story-config.js` 的 `artifacts` 中配置名称、图标、封面和提示文本；剧情或调试接口调用 `QingyunStoryAPI.grantArtifact('法宝ID')` 后，法宝会自动进入左侧栏位。栏位按实际数量增长并支持滚动查看。当前存档格式为第 5 版，旧存档会自动迁移。

宗门任务支持连勤：连续领取完成 3 个任务会额外获得 5 点贡献，连勤次数会写入存档并在任务栏显示。
连续完成 9 个任务会解锁成就“勤修不辍”；`QingyunStoryAPI.diagnostics().questStreak` 可读取当前连勤次数，`currentEventConditions` 可读取当前卡牌的完整解锁条件。

顶部“备份”可下载当前 JSON 存档；“导入”会在确认后读取备份并自动迁移旧版本，适合换设备或清理浏览器数据前保存进度。

配置中的 `moonLamp` 会在“古洞机缘”卡牌选择“记录符文”时作为剧情奖励获得；`beastHorn` 会在“后山巡夜”选择“独自追踪”时获得；`frostNeedle`、`spiritGourd`、`cloudSeal`、`starCompass` 分别接入“秘境裂隙”“万宝商舟”“古战场残魂”“法宝器灵”节点；`heartMirror` 会在“心魔低语”选择“斩断心魔”时获得。八件法宝也可用 `QingyunStoryAPI.grantArtifact()` 测试栏位和属性效果。

法宝也可以配置主动效果：`active:{label:'安神照魄',cost:{qi:12},effect:{heart:8},cooldown:3}`。冷却按行动计算，每次行动半年，因此示例中的 `cooldown:3` 会显示为 3 次行动（1.5 年）。获得法宝后点击左侧栏位，在详情面板中使用；消耗、效果和冷却都会自动存档。`cost` 与 `effect` 支持 `qi`、`hp`、`heart`、`fame`、`stone`、`life`、`contribution` 等状态字段。

功法与灵根会按五行关系计算适配：同属性为“相合”并获得 +6%，灵根生功法属性为“相生”并获得 +3%，被克制为“相克”并获得 -3%，其余不匹配为“相冲”并获得 -4%；青云练气决的五行全适配保持均衡定位。

剧情脚本也可调用 `QingyunStoryAPI.useArtifact('moonLamp')` 主动发动已获得的法宝；未获得、资源不足、无主动效果或仍在冷却时返回 `false`，成功发动返回 `true`，不会绕过规则。

事件还支持 `requiresConfiguredArtifact:'moonLamp'`，只有获得指定配置法宝后才会进入卡池；适合编写法宝专属支线。

当前示例中，获得 `heartMirror` 后，修行第 12 年起会进入“定心试炼”专属卡牌；法宝收集会因此改变后续卡池，而不只是提供被动属性。

后续剧情也可以用 `QingyunStoryAPI.setEventCondition('外门讲法',{minYear:3,requiresTalent:true})` 覆盖卡牌条件；支持年份、境界、人物、法宝、灵根、道途和状态等字段。使用 `removeEventCondition()` 可恢复默认条件。

改写卡牌文案可使用 `QingyunStoryAPI.setEventContent('外门讲法',{title:'新的标题',copy:'新的描述',left:'左侧选项',right:'右侧选项',a:{fame:5}})`；支持标题、正文、引语、左右选项、结果属性和锁定提示等字段。使用 `removeEventContent()` 可恢复默认内容，事件的主线条件与好感规则仍保持独立。

每一世还会自动记录见过的卡牌（包含第一幕入门卡），因果簿下方的“卡牌图鉴”会显示探索进度；图鉴只保存事件类型，不会把完整剧情写入存档，适合长期收集和反复体验。

图鉴中的卡牌会标记为第一幕、人物因缘、多年因果、法宝秘境、道途专属、九州天时或主线节点，方便按路线收集。
图鉴支持按路线筛选，并在筛选项中显示该路线的“已探索 / 总数”，适合专门补齐某一条因果线。
当前卡牌顶部也会显示对应路线标签，进入决策前即可判断它属于主线、人物、因果或秘境内容。
每次左右选择后的结算提示会显示实际资源差值、人物好感牵连和新获得的法宝，预览信息则保留在下方作为对照。
移动端会将左侧法宝栏自动改为底部横向滚动栏，避免遮挡卡牌；桌面端仍保持左侧固定栏位。
宗门任务完成后会高亮任务面板并提供完整奖励提示，连勤次数也会一并显示，方便判断领取时机。
启动时会校正存档中的“场景 / 是否入宗”标记，导入旧版或手工备份时不会因字段缺失误回第一幕。
卡牌选项预览会额外标记“气血见底、资源将耗尽或寿元不足半年”等风险，方便在拖动前做取舍。
高风险方向还会同步变为警示色按钮，普通资源扣除不会触发警示。

卡牌上方的“如何修行”说明默认收起，首次进入时可快速查看左右选择、上滑打坐、键盘快捷键和第一幕限制。

顶部“轮回”状态会持续显示已完成世数、最高境界和结局收集进度，方便在每一局修行中追踪长期成长。

寿元耗尽进入结局页时，还会显示本世探索卡牌数，让探索支线也成为每一轮的明确目标。

编写后续剧情时可调用只读接口 `QingyunStoryAPI.artifactCatalog()`，获得每件法宝的 ID、名称、是否已获得、是否有主动技能及关联共鸣 ID，适合用来生成剧情条件、提示文本或调试面板。

剧情奖励可在 `artifactRewards` 中按“卡牌类型 + left/right”配置，例如 `{ '古洞机缘': { right: 'moonLamp' } }`；玩家选择该方向时会自动获得法宝。

多件法宝可以在 `resonances` 中配置共鸣，使用 `requires` 列出所需法宝 ID，并直接填写 `combatBonus`、`recovery` 或 `meditationScale` 等属性；全部集齐后会自动激活并显示在背包。

调试时调用 `QingyunStoryAPI.diagnostics().resonances` 可查看当前已激活的共鸣 ID。

也可以用 `QingyunStoryAPI.setArtifactResonance('自定义共鸣', {name:'共鸣名', requires:['moonLamp','beastHorn'], combatBonus:4})` 临时新增共鸣，用 `removeArtifactResonance()` 清除。

调试时也可调用 `QingyunStoryAPI.setArtifactReward('古洞机缘', 'right', 'moonLamp')` 临时修改奖励路线，使用 `removeArtifactReward()` 清除。
