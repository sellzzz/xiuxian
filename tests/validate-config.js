const fs = require('fs');
const vm = require('vm');
const path = require('path');

const configPath = path.join(__dirname, '..', 'config', 'story-config.js');
const source = fs.readFileSync(configPath, 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: configPath });

const config = sandbox.window.QINGYUN_STORY_OVERRIDES;
if (!config || typeof config !== 'object') throw new Error('story config did not initialize');

const numericFields = ['combatBonus', 'meditationScale', 'recovery', 'breakthroughBonus', 'examBonus'];
const stateFields = ['qi', 'hp', 'heart', 'fame', 'stone', 'life', 'contribution'];
for (const [id, artifact] of Object.entries(config.artifacts || {})) {
  if (!artifact || typeof artifact !== 'object') throw new Error(`invalid artifact: ${id}`);
  if (!artifact.name) throw new Error(`artifact missing name: ${id}`);
  if (!artifact.icon && !artifact.image) throw new Error(`artifact missing icon/image: ${id}`);
  if (artifact.image && !fs.existsSync(path.join(__dirname, '..', artifact.image))) {
    throw new Error(`artifact image not found: ${id} -> ${artifact.image}`);
  }
  for (const field of numericFields) {
    if (field in artifact && !Number.isFinite(Number(artifact[field]))) {
      throw new Error(`artifact field must be numeric: ${id}.${field}`);
    }
  }
  if ('meditationScale' in artifact && Number(artifact.meditationScale) <= 0) {
    throw new Error(`artifact meditationScale must be positive: ${id}`);
  }
  if (artifact.active) {
    if (typeof artifact.active !== 'object') throw new Error(`invalid artifact active rule: ${id}`);
    if (artifact.active.cost && typeof artifact.active.cost !== 'object') throw new Error(`invalid artifact active cost: ${id}`);
    if (artifact.active.effect && typeof artifact.active.effect !== 'object') throw new Error(`invalid artifact active effect: ${id}`);
    if ('cooldown' in artifact.active && (!Number.isFinite(Number(artifact.active.cooldown)) || Number(artifact.active.cooldown) <= 0)) {
      throw new Error(`artifact active cooldown must be positive: ${id}`);
    }
    for (const [kind, values] of [['cost', artifact.active.cost], ['effect', artifact.active.effect]]) {
      if (!values) continue;
      for (const [key, value] of Object.entries(values)) {
        if (!stateFields.includes(key)) throw new Error(`unknown artifact active state field: ${id}.${key}`);
        if (!Number.isFinite(Number(value))) throw new Error(`artifact active ${kind} must be numeric: ${id}.${key}`);
        if (kind === 'cost' && Number(value) < 0) throw new Error(`artifact active cost must be non-negative: ${id}.${key}`);
      }
    }
  }
}

for (const [eventType, branches] of Object.entries(config.artifactRewards || {})) {
  if (!branches || typeof branches !== 'object') throw new Error(`invalid artifact reward rule: ${eventType}`);
  for (const side of Object.keys(branches)) {
    if (!['left', 'right'].includes(side)) throw new Error(`invalid artifact reward direction: ${eventType}.${side}`);
  }
  for (const side of ['left', 'right']) {
    if (!(side in branches)) continue;
    const rewards = Array.isArray(branches[side]) ? branches[side] : [branches[side]];
    if (!rewards.length) throw new Error(`empty artifact reward: ${eventType}.${side}`);
    for (const id of rewards) {
      if (typeof id !== 'string' || !config.artifacts[id]) {
        throw new Error(`unknown artifact reward: ${eventType}.${side} -> ${id}`);
      }
    }
  }
}

for (const [id, resonance] of Object.entries(config.resonances || {})) {
  if (!resonance || typeof resonance !== 'object') throw new Error(`invalid artifact resonance: ${id}`);
  if (!resonance.name) throw new Error(`artifact resonance missing name: ${id}`);
  if (!Array.isArray(resonance.requires) || !resonance.requires.length) throw new Error(`artifact resonance missing requirements: ${id}`);
  for (const required of resonance.requires) {
    if (typeof required !== 'string' || !config.artifacts[required]) throw new Error(`unknown artifact resonance requirement: ${id} -> ${required}`);
  }
  for (const field of numericFields) {
    if (field in resonance && !Number.isFinite(Number(resonance[field]))) throw new Error(`artifact resonance field must be numeric: ${id}.${field}`);
  }
  if ('meditationScale' in resonance && Number(resonance.meditationScale) <= 0) throw new Error(`artifact resonance meditationScale must be positive: ${id}`);
}

const eventConditionFields = new Set(['minYear', 'maxYear', 'ranks', 'requiresCompanion', 'requiresMaster', 'requiresEstate', 'requiresArtifact', 'requiresConfiguredArtifact', 'requiresTalent', 'requiresDemonVictory', 'rootGrades', 'worldCycles', 'requiresStatus', 'requiresPath', 'causalKey']);
const eventConditionLists = new Set(['ranks', 'rootGrades', 'worldCycles']);
const eventConditionFlags = new Set(['requiresArtifact', 'requiresMaster', 'requiresEstate', 'requiresTalent', 'requiresDemonVictory']);
for (const [eventType, condition] of Object.entries(config.eventConditions || {})) {
  if (!condition || typeof condition !== 'object' || Array.isArray(condition)) throw new Error(`invalid event condition: ${eventType}`);
  for (const [key, value] of Object.entries(condition)) {
    if (!eventConditionFields.has(key)) throw new Error(`unknown event condition field: ${eventType}.${key}`);
    if (key === 'minYear' || key === 'maxYear') {
      if (!Number.isFinite(Number(value))) throw new Error(`event condition year must be numeric: ${eventType}.${key}`);
    } else if (eventConditionLists.has(key)) {
      if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) throw new Error(`event condition list is invalid: ${eventType}.${key}`);
    } else if (eventConditionFlags.has(key)) {
      if (typeof value !== 'boolean') throw new Error(`event condition flag is invalid: ${eventType}.${key}`);
    } else if (typeof value !== 'string') {
      throw new Error(`event condition value is invalid: ${eventType}.${key}`);
    }
    if (key === 'requiresConfiguredArtifact' && !config.artifacts[value]) {
      throw new Error(`unknown event condition artifact: ${eventType} -> ${value}`);
    }
  }
}

console.log(`Config validation passed: ${Object.keys(config.artifacts || {}).length} artifacts.`);
