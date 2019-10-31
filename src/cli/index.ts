import minimist from 'minimist';

import { logError } from '../errors';

import { setup } from './setup';
import { start } from './start';

export async function cli(argv: Array<string>): Promise<void> {
  const [first, ...rest] = argv;

  try {
    if (first === 'setup') {
      await setup(minimist(rest));
      return;
    }
    await start(minimist(argv));
    return;
  } catch (e) {
    logError(e);
  }
}
