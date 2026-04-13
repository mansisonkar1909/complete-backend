import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Server.js location:', __dirname);
console.log('Starting app from:', __dirname + '/src/index.js');

// Dynamically import with full absolute path
const indexPath = new URL('./src/index.js', import.meta.url).href;
console.log('Index path:', indexPath);

import(indexPath).catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
});