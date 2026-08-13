const fs = require('fs');
const vm = require('vm');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'app.js'), 'utf8');
const start = source.indexOf('function choiceLifeCost()');
const end = source.indexOf('function spendLife', start);
if (start < 0 || end < 0) throw new Error('life rule functions not found');

const sandbox = { state: null };
vm.runInNewContext(`${source.slice(start, end)};result=canAdvanceLife;`, sandbox);
const canAdvanceLife = sandbox.result;

if (!canAdvanceLife({ scene: 'prologue', life: 0 })) throw new Error('prologue should not consume life');
if (!canAdvanceLife({ scene: 'main', life: 0.5 })) throw new Error('half-year life should allow one action');
if (canAdvanceLife({ scene: 'main', life: 0.49 })) throw new Error('insufficient life should block action');
if (canAdvanceLife({ scene: 'main', life: null })) throw new Error('invalid life should block action');

console.log('Life rule validation passed.');
