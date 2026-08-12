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
  artifactRewards: {'古洞机缘': {right: 'moonLamp'}, '后山巡夜': {right: 'beastHorn'}},
  resonances: {moonHorn: {name:'月角同鸣', requires:['moonLamp','beastHorn'], description:'月华与兽魂相互牵引：战力 +5、气血恢复 +1、打坐效率 +5%。', combatBonus:5, recovery:1, meditationScale:1.05}},
  artifacts: {
    moonLamp: {name:'月魄灯', icon:'灯', hint:'静心法宝 · 古洞机缘奖励', description:'记录石门符文后，月华凝成灯火；可辅助修行，也能主动安神。', combatBonus:8, meditationScale:1.08, recovery:2, breakthroughBonus:0.03, examBonus:3, active:{label:'安神照魄', hint:'消耗 12 灵力，恢复 8 道心；冷却 3 回合。', cost:{qi:12}, effect:{heart:8}, cooldown:3}},
    beastHorn: {name:'伏兽角', icon:'角', hint:'杀伐法宝 · 后山巡夜奖励', description:'以妖兽残角炼成的号角，吹响时能震慑山野精怪，也令你的声名传得更远。', combatBonus:6, examBonus:2, active:{label:'兽魂震慑', hint:'消耗 10 道心，获得 8 声望；冷却 4 回合。', cost:{heart:10}, effect:{fame:8}, cooldown:4}}
  }
};
