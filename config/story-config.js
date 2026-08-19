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
  eventContent: {},
  oneTimeEvents: [],
  artifactGacha: {
    ticketName: '机缘签',
    singleCost: 3,
    tenCost: 27,
    pity: 10,
    duplicateContribution: 8,
    pool: ['moonLamp','beastHorn','frostNeedle','spiritGourd','cloudSeal','starCompass','warBanner','heartMirror'],
    rare: ['frostNeedle','cloudSeal','starCompass','warBanner']
  },
  // 云海裂隙：区域目标数量是完整卡池规划，cards 先放可玩的样例，后续可直接追加卡牌对象。
  secretRealm: {
    id: 'cloudRift',
    name: '云海裂隙',
    entryWindow: {minYear: 5, maxYear: 7},
    monthCost: 1,
    lockedUp: true,
    regions: {
      entrance: {name:'秘境入口', target:1, next:'ruins'},
      ruins: {name:'迷雾废墟', target:25, next:'core'},
      swamp: {name:'毒蚀沼泽', target:25, next:'core'},
      core: {name:'核心：核心剑冢', target:35, branches:{left:'immortalStage',right:'spaceStorm'}},
      immortalStage: {name:'深处：登仙石台', target:10, next:'complete'},
      spaceStorm: {name:'退路：空间风暴', target:4, next:'complete'}
    },
    cards: [
      {id:'cloud-entry',region:'entrance',type:'云海裂隙·入口',title:'云海裂开一道无声的门',copy:'入口卡在半空，门后传来剑鸣与腐沼的腥气。',quote:'“秘境不问来路，只问你要走哪条路。”',left:'踏入迷雾废墟',right:'进入毒蚀沼泽',a:{heart:2},b:{qi:5},lockedUp:true},
      {id:'ruins-iron',region:'ruins',type:'迷雾废墟·玄铁',title:'残垣下埋着一截玄铁剑脊',copy:'雾气吞吐间，剑脊仍在微微震动。',left:'挖出玄铁',right:'顺着剑痕深入',a:{stone:12,qi:4},b:{hp:-5,heart:5},lockedUp:true},
      {id:'ruins-echo',region:'ruins',type:'迷雾废墟·回声',title:'废墟深处传来与你相同的脚步声',copy:'回声像另一个你，在雾中提前做出了选择。',left:'闭目辨位',right:'追上回声',a:{heart:8},b:{hp:-8,qi:12},lockedUp:true},
      {id:'swamp-lotus',region:'swamp',type:'毒蚀沼泽·青莲',title:'毒雾中浮起一朵青色莲花',copy:'莲心没有毒，花茎却扎在一具古修士的骸骨上。',left:'以灵力隔空采摘',right:'踏入毒潭取花',a:{qi:10,stone:6},b:{hp:-12,heart:10},lockedUp:true},
      {id:'swamp-beast',region:'swamp',type:'毒蚀沼泽·遗蜕',title:'沼泽底下睁开一只金色竖瞳',copy:'庞大的遗蜕挡住了唯一的干路。',left:'绕行寻找出口',right:'斩断遗蜕',a:{heart:4,stone:8},b:{hp:-15,qi:18},lockedUp:true},
      {id:'core-sword',region:'core',type:'核心剑冢·无主剑',title:'万剑归墟，唯有一柄断剑仍在等你',copy:'剑冢上空没有风，所有剑尖却同时转向了你。',left:'拔出断剑',right:'接受剑意洗礼',a:{qi:25,heart:-8},b:{hp:-18,heart:18},lockedUp:true},
      {id:'core-guard',region:'core',type:'核心剑冢·守门人',title:'石门后的残魂问你为何求仙',copy:'它不在意你的答案是否高明，只在意你是否言行一致。',left:'以凡心作答',right:'以道心作答',a:{heart:12,fame:5},b:{qi:18,hp:-8},lockedUp:true},
      {id:'stage-heaven',region:'immortalStage',type:'登仙石台·天门',title:'石台尽头浮现一线天门',copy:'门后是一步登天的诱惑，也是提前结束此行的代价。',left:'记录天门坐标后退回',right:'触碰天门',a:{heart:16,stone:20},b:{qi:40,hp:-20},lockedUp:true},
      {id:'storm-escape',region:'spaceStorm',type:'空间风暴·退路',title:'空间风暴撕开了返回青云宗的缝隙',copy:'再迟一月，裂隙就会把你和所有收获一起吞没。',left:'立刻脱身',right:'冒险回收遗物',a:{stone:25,heart:6},b:{hp:-25,qi:22},lockedUp:true}
    ]
  },
  legacyBoons: {},
  // 可调整道途面板的预计节点年份；只影响提示，不会改变事件本身的触发规则。
  journeyYears: {promotion:7, trial:13, tribulation:17, inner:20, foundation:30, succession:60, demonRealm:70, ascension:82},
  artifactRewards: {'古洞机缘': {right: 'moonLamp'}, '后山巡夜': {right: 'beastHorn'}, '秘境裂隙': {right: 'frostNeedle'}, '万宝商舟': {left: 'spiritGourd'}, '古战场残魂': {left: 'warBanner', right: 'cloudSeal'}, '法宝器灵': {right: 'starCompass'}, '心魔低语': {left: 'heartMirror'}},
  resonances: {
    moonHorn: {name:'月角同鸣', requires:['moonLamp','beastHorn'], description:'月华与兽魂相互牵引：战力 +5、气血恢复 +1、打坐效率 +5%。', combatBonus:5, recovery:1, meditationScale:1.05},
    coldSpring: {name:'寒泉回生', requires:['frostNeedle','spiritGourd'], description:'寒魄与养元之力相济：气血恢复 +2、打坐效率 +3%。', recovery:2, meditationScale:1.03},
    starGate: {name:'星门照命', requires:['cloudSeal','starCompass'], description:'青云法印与观星盘共同推演天机：突破 +5%、评定 +3。', breakthroughBonus:0.05, examBonus:3},
    warMarch: {name:'战旗镇魂', requires:['warBanner','beastHorn'], description:'镇魂战旗与伏兽角共鸣：战力 +8、评定 +3。', combatBonus:8, examBonus:3},
    heartMoon: {name:'月下明心', requires:['heartMirror','moonLamp'], description:'定心玉映照月魄灯：战力 +5、评定 +2，道心更不易受外物动摇。', combatBonus:5, examBonus:2}
  },
  artifacts: {
    moonLamp: {name:'月魄灯', icon:'灯', hint:'静心法宝 · 古洞机缘奖励', description:'记录石门符文后，月华凝成灯火；可辅助修行，也能主动安神。', combatBonus:8, meditationScale:1.08, recovery:2, breakthroughBonus:0.03, examBonus:3, active:{label:'安神照魄', hint:'消耗 12 灵力，恢复 8 道心；冷却 3 回合。', cost:{qi:12}, effect:{heart:8}, cooldown:3}},
    beastHorn: {name:'伏兽角', icon:'角', hint:'杀伐法宝 · 后山巡夜奖励', description:'以妖兽残角炼成的号角，吹响时能震慑山野精怪，也令你的声名传得更远。', combatBonus:6, examBonus:2, active:{label:'兽魂震慑', hint:'消耗 10 道心，获得 8 声望；冷却 4 回合。', cost:{heart:10}, effect:{fame:8}, cooldown:4}},
    frostNeedle: {name:'寒魄针', icon:'针', hint:'冰魄法宝 · 秘境裂隙奖励', description:'秘境核心凝成的三寸寒芒，能压制伤势，也让战斗中的第一击更为凌厉。', combatBonus:10, recovery:1, active:{label:'寒魄封脉', hint:'消耗 14 灵力，恢复 12 气血；冷却 4 回合。', cost:{qi:14}, effect:{hp:12}, cooldown:4}},
    spiritGourd: {name:'养元葫', icon:'葫', hint:'滋养法宝 · 万宝商舟奖励', description:'葫中灵露会随四时自行凝聚，闭关时能够温养经脉，亦可在危急时刻救命。', meditationScale:1.06, recovery:3, active:{label:'灵露回春', hint:'消耗 6 灵石，恢复 18 气血；冷却 3 回合。', cost:{stone:6}, effect:{hp:18}, cooldown:3}},
    cloudSeal: {name:'青云法印', icon:'印', hint:'宗门法宝 · 古战场残魂奖励', description:'古战法留下的宗门印记，能将你的名望化为真正的宗门号令。', examBonus:5, breakthroughBonus:0.02, active:{label:'敕令护持', hint:'消耗 8 贡献，获得 12 声望；冷却 5 回合。', cost:{contribution:8}, effect:{fame:12}, cooldown:5}},
    starCompass: {name:'观星盘', icon:'盘', hint:'推演法宝 · 法宝器灵奖励', description:'器灵以星轨为弦，替你寻找突破前最薄弱的一处天机。', breakthroughBonus:0.04, examBonus:2, active:{label:'观星定命', hint:'消耗 18 灵力，恢复 10 道心；冷却 5 回合。', cost:{qi:18}, effect:{heart:10}, cooldown:5}},
    warBanner: {name:'镇魂战旗', icon:'旗', hint:'仁心法宝 · 古战场超度奖励', description:'你超度古战残魂后留下的战旗，能将亡者未散的守护化为护宗之力。', combatBonus:14, examBonus:4, active:{label:'镇魂护阵', hint:'消耗 10 声望，恢复 8 道心；冷却 4 回合。', cost:{fame:10}, effect:{heart:8}, cooldown:4}},
    heartMirror: {name:'定心玉', icon:'玉', hint:'镇心法宝 · 心魔低语奖励', description:'斩断心魔后凝成的玉珏，能照见贪念，也能在真正动摇前替你守住一线清明。', combatBonus:4, breakthroughBonus:0.02, active:{label:'照见本心', hint:'消耗 8 道心，恢复 10 气血；冷却 4 回合。', cost:{heart:8}, effect:{hp:10}, cooldown:4}}
  }
};
