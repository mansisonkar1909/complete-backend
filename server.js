import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { chdir } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Running from:', __dirname);
chdir(__dirname);
console.log('Changed to:', process.cwd());

import('./src/index.js').catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
});