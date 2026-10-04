const { createHash } = require('node:crypto');
const { readFileSync, writeFileSync } = require('node:fs');
const { resolve } = require('node:path');

const root = resolve(__dirname, '..');
const htmlPath = resolve(root, 'index.html');
let html = readFileSync(htmlPath, 'utf8');

for (const asset of ['style.css', 'translations.js', 'script.js']) {
    const version = createHash('sha256')
        .update(readFileSync(resolve(root, asset)))
        .digest('hex')
        .slice(0, 12);
    const escaped = asset.replace(/\./g, '\\.');
    const reference = new RegExp(`((?:href|src)="${escaped})(?:\\?v=[a-f0-9]+)?"`, 'g');
    if (!reference.test(html)) throw new Error(`Missing HTML reference for ${asset}`);
    html = html.replace(reference, `$1?v=${version}"`);
}

writeFileSync(htmlPath, html);
console.log('Updated stylesheet and script URLs to match their contents.');
