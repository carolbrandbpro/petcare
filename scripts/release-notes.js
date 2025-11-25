#!/usr/bin/env node
const cp = require('child_process');

function getRepo(){
  const url = cp.execSync('git remote get-url origin').toString().trim();
  const m = url.match(/github.com[:\/](.+?)(\.git)?$/);
  if(!m) throw new Error('Remote origin não é GitHub');
  return m[1];
}

const repo = getRepo();
const tag = process.env.npm_config_tag || process.argv[2] || '';
const q = tag ? `?tag=${tag}` : '';
const u = `https://github.com/${repo}/releases/new${q}`;

const cmd = process.platform === 'win32'
  ? `powershell -NoProfile -Command Start-Process '${u.replace(/'/g, "''")}'`
  : process.platform === 'darwin'
    ? `open '${u}'`
    : `xdg-open '${u}'`;

cp.execSync(cmd, { stdio: 'inherit' });