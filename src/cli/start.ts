import { startScreenReader } from '../index';
import { UnknownOptions } from '../options';

export async function start(options: UnknownOptions): Promise<void> {
  const result = await startScreenReader(validateOptions(options));

  process.stdout.write(result);
}

function validateOptions(
  options: UnknownOptions
): UnknownOptions & { waitForStable: true } {
  return {
    waitForStable: true,
    ...options
  };
}
