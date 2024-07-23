import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const eslintConfigPreact = require('eslint-config-preact');

import { eslintConfig } from '@brybrant/configs';

export default eslintConfig(eslintConfigPreact);