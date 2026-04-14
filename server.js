import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { chdir } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

chdir(__dirname);

const indexUrl = new URL('file://' + __dirname + '/src/index.js');
import(indexUrl).catch(console.error);