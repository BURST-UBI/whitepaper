import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const file = resolve(root, 'protocol-source.json');
const source = JSON.parse(readFileSync(file, 'utf8'));
const checkout = resolve(root, '.protocol');
const update = process.argv.includes('--update');
if (process.argv.slice(2).some(arg => arg !== '--update')) throw new Error('Usage: node tools/prepare-protocol.mjs [--update]');
if (source.repository !== 'https://github.com/BURST-UBI/protocol.git' || !/^[a-f0-9]{40}$/.test(source.commit)) throw new Error('Invalid protocol source');
const git = args => execFileSync('git', ['-C', checkout, ...args], {encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit']}).trim();
if (!existsSync(resolve(checkout, '.git'))) {
  mkdirSync(checkout, {recursive: true});
  git(['init', '-q']);
  git(['remote', 'add', 'origin', source.repository]);
}
if (git(['remote', 'get-url', 'origin']) !== source.repository) throw new Error('Unexpected protocol checkout remote');
if (git(['status', '--porcelain'])) throw new Error('Protocol checkout has local edits; preserve or commit them before syncing');
let head = '';
try { head = git(['rev-parse', '--verify', '--quiet', 'HEAD']); } catch { /* Fresh checkout. */ }
if (update || head !== source.commit) {
  git(['fetch', '--depth=1', 'origin', update ? source.ref : source.commit]);
  const commit = update ? git(['rev-parse', 'FETCH_HEAD']) : source.commit;
  git(['checkout', '--detach', '-q', commit]);
  if (update) {
    source.commit = commit;
    writeFileSync(file, JSON.stringify(source, null, 2) + '\n');
  }
}
console.log(`Documentation source: protocol ${source.commit}`);
