import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const template = JSON.parse(
  readFileSync(resolve(__dirname, 'manifest.template.json'), 'utf-8')
);
const sites = JSON.parse(
  readFileSync(resolve(__dirname, 'sites.json'), 'utf-8')
);

template.content_scripts = sites.map((site) => ({
  matches: site.matches,
  css: [site.css],
  ...(site.js ? { js: [site.js] } : {}),
}));

writeFileSync(
  resolve(__dirname, 'manifest.json'),
  JSON.stringify(template, null, 2) + '\n'
);

console.log(`✓ manifest.json generated with ${sites.length} site(s)`);
