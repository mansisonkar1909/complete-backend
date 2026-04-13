import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { chdir } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Force working directory to project root
chdir(__dirname);

// Now import index.js
import('./src/index.js').catch(console.error);