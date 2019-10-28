import minimist from 'minimist';

import { startScreenReader } from './index';
import { Options } from './options';
import { getScreenReaderName } from './get-screenreader';

type CLIOptions = {
  screenreader: string;
  filters: Array<string>;
  pollTimeout: number;
  stableTimeout: number;
};

export async function cli(argv: Array<string>): Promise<void> {
  const options = mapCLIArgs(minimist(argv) as Partial<CLIOptions>);

  const result = await startScreenReader(options);

  process.stdout.write(result);
}

function mapCLIArgs(
  cliOptions: Partial<CLIOptions>
): Partial<Options> & { waitForStable: true } {
  return {
    waitForStable: true,
    screenreader: getScreenReaderName(cliOptions.screenreader),
    filters: (cliOptions.filters || []).map(f => new RegExp(f)),
    pollTimeout: cliOptions.pollTimeout,
    stableTimeout: cliOptions.stableTimeout
  };
}
