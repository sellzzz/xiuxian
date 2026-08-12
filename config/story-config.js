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
  eventConditions: {},
  artifactRewards: {'古洞机缘': {right: 'moonLamp'}, '后山巡夜': {right: 'beastHorn'}, '秘境裂隙': {right: 'frostNeedle'}, '万宝商舟': {left: 'spiritGourd'}, '古战场残魂': {left: 'warBanner', right: 'cloudSeal'}, '法宝器灵': {right: 'starCompass'}},
  resonances: {
    moonHorn: {name:'月角同鸣', requires:['moonLamp','beastHorn'], description:'月华与兽魂相互牵引：战力 +5、气血恢复 +1、打坐效率 +5%。', combatBonus:5, recovery:1, meditationScale:1.05},
    coldSpring: {name:'寒泉回生', requires:['frostNeedle','spiritGourd'], description:'寒魄与养元之力相济：气血恢复 +2、打坐效率 +3%。', recovery:2, meditationScale:1.03},
    starGate: {name:'星门照命', requires:['cloudSeal','starCompass'], description:'青云法印与观星盘共同推演天机：突破 +5%、评定 +3。', breakthroughBonus:0.05, examBonus:3},
    warMarch: {name:'战旗镇魂', requires:['warBanner','beastHorn'], description:'镇魂战旗与伏兽角共鸣：战力 +8、评定 +3。', combatBonus:8, examBonus:3}
  },
  artifacts: {
    moonLamp: {name:'月魄灯', icon:'灯', hint:'静心法宝 · 古洞机缘奖励', description:'记录石门符文后，月华凝成灯火；可辅助修行，也能主动安神。', combatBonus:8, meditationScale:1.08, recovery:2, breakthroughBonus:0.03, examBonus:3, active:{label:'安神照魄', hint:'消耗 12 灵力，恢复 8 道心；冷却 3 回合。', cost:{qi:12}, effect:{heart:8}, cooldown:3}},
    beastHorn: {name:'伏兽角', icon:'角', hint:'杀伐法宝 · 后山巡夜奖励', description:'以妖兽残角炼成的号角，吹响时能震慑山野精怪，也令你的声名传得更远。', combatBonus:6, examBonus:2, active:{label:'兽魂震慑', hint:'消耗 10 道心，获得 8 声望；冷却 4 回合。', cost:{heart:10}, effect:{fame:8}, cooldown:4}},
    frostNeedle: {name:'寒魄针', icon:'针', hint:'冰魄法宝 · 秘境裂隙奖励', description:'秘境核心凝成的三寸寒芒，能压制伤势，也让战斗中的第一击更为凌厉。', combatBonus:10, recovery:1, active:{label:'寒魄封脉', hint:'消耗 14 灵力，恢复 12 气血；冷却 4 回合。', cost:{qi:14}, effect:{hp:12}, cooldown:4}},
    spiritGourd: {name:'养元葫', icon:'葫', hint:'滋养法宝 · 万宝商舟奖励', description:'葫中灵露会随四时自行凝聚，闭关时能够温养经脉，亦可在危急时刻救命。', meditationScale:1.06, recovery:3, active:{label:'灵露回春', hint:'消耗 6 灵石，恢复 18 气血；冷却 3 回合。', cost:{stone:6}, effect:{hp:18}, cooldown:3}},
    cloudSeal: {name:'青云法印', icon:'印', hint:'宗门法宝 · 古战场残魂奖励', description:'古战法留下的宗门印记，能将你的名望化为真正的宗门号令。', examBonus:5, breakthroughBonus:0.02, active:{label:'敕令护持', hint:'消耗 8 贡献，获得 12 声望；冷却 5 回合。', cost:{contribution:8}, effect:{fame:12}, cooldown:5}},
    starCompass: {name:'观星盘', icon:'盘', hint:'推演法宝 · 法宝器灵奖励', description:'器灵以星轨为弦，替你寻找突破前最薄弱的一处天机。', breakthroughBonus:0.04, examBonus:2, active:{label:'观星定命', hint:'消耗 18 灵力，恢复 10 道心；冷却 5 回合。', cost:{qi:18}, effect:{heart:10}, cooldown:5}},
    warBanner: {name:'镇魂战旗', icon:'旗', hint:'仁心法宝 · 古战场超度奖励', description:'你超度古战残魂后留下的战旗，能将亡者未散的守护化为护宗之力。', combatBonus:14, examBonus:4, active:{label:'镇魂护阵', hint:'消耗 10 声望，恢复 8 道心；冷却 4 回合。', cost:{fame:10}, effect:{heart:8}, cooldown:4}}
  }
};
