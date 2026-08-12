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
for (const [id, artifact] of Object.entries(config.artifacts || {})) {
  if (!artifact || typeof artifact !== 'object') throw new Error(`invalid artifact: ${id}`);
  if (!artifact.name) throw new Error(`artifact missing name: ${id}`);
  if (!artifact.icon && !artifact.image) throw new Error(`artifact missing icon/image: ${id}`);
  for (const field of numericFields) {
    if (field in artifact && !Number.isFinite(Number(artifact[field]))) {
      throw new Error(`artifact field must be numeric: ${id}.${field}`);
    }
  }
}

console.log(`Config validation passed: ${Object.keys(config.artifacts || {}).length} artifacts.`);
