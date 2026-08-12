/*
 * 青云宗剧情扩展入口
 *
 * 人物键：steward = 柳管事，peers = 苏晚，spirit = 白璃
 * 方向键：left = 向左选择，right = 向右选择
 *
 * 新增或覆盖事件好感示例：
 * relationshipEvents: {
 *   '新剧情卡牌类型': {
 *     left: { steward: 5, peers: -3 },
 *     right: { spirit: 12 }
 *   }
 * }
 *
 * 人际联动系数示例：peers: { spirit: 0.25 }
 * 表示苏晚每变化 10 点好感，白璃会同向变化约 3 点。
 * 使用负数则表示两人立场相冲。
 */
window.QINGYUN_STORY_OVERRIDES = {
  relationshipEvents: {},
  influenceRules: {},
  artifactRewards: {},
  artifacts: {
    moonLamp: {name:'月魄灯', icon:'灯', hint:'静心法宝 · 尚未纳入主线', description:'可作为支线奖励的配置示例。', combatBonus:8, meditationScale:1.08, recovery:2, breakthroughBonus:0.03, examBonus:3, active:{label:'安神照魄', hint:'消耗 12 灵力，恢复 8 道心；冷却 3 回合。', cost:{qi:12}, effect:{heart:8}, cooldown:3}}
  }
};
