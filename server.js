import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { chdir } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Force working directory to where server.js is
chdir(__dirname);

console.log('Current directory:', process.cwd());
console.log('Dirname:', __dirname);

// Import index.js relatively
import(__dirname + '/src/index.js').catch(console.error);