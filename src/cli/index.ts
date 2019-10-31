import minimist from 'minimist';

import { logError } from '../errors';

import { start } from './start';

export async function cli(argv: Array<string>): Promise<void> {
  try {
    await start(minimist(argv));
    return;
  } catch (e) {
    logError(e);
  }
}
