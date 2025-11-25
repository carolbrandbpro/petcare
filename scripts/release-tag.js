#!/usr/bin/env node
const { execSync } = require('child_process');

const tag = process.env.npm_config_tag || process.argv[2];
if (!tag) {
  console.error('Uso: npm run release:tag -- vX.Y.Z');
  process.exit(1);
}

execSync(`git tag -a ${tag} -m "${tag}"`, { stdio: 'inherit' });
execSync(`git push origin ${tag}`, { stdio: 'inherit' });
console.log(`Tag ${tag} enviada para o remoto. O GitHub Actions irá publicar a Release.`);