import { instantiateScreenReader } from './screenreaders';
import {
  UnknownOptions,
  validateScreenReaderName,
  validatePollTimeout,
  validateStableTimeout,
  validateWaitForStable,
  validateFilters,
  validateMappers
} from './options';
import { ErrorCodes, SRRError, logError } from './errors';

let reading = false;

export async function startScreenReader(
  options: UnknownOptions & { waitForStable: true }
): Promise<string>;

export async function startScreenReader(
  options: UnknownOptions & { waitForStable?: false }
): Promise<() => Promise<string>>;

export async function startScreenReader(
  options: UnknownOptions
): Promise<string | (() => Promise<string>)> {
  try {
    return tryStartScreenReader(options);
  } catch (e) {
    logError(e);
    throw e;
  }
}

async function tryStartScreenReader(
  options: UnknownOptions
): Promise<string | (() => Promise<string>)> {
  if (reading) {
    throw new SRRError(ErrorCodes.CANT_START_WHILE_STARTED);
  }

  reading = true;

  const finalOptions = {
    waitForStable: validateWaitForStable(options.waitForStable),
    screenreader: validateScreenReaderName(options.screenreader),
    pollTimeout: validatePollTimeout(options.pollTimeout),
    stableTimeout: validateStableTimeout(options.stableTimeout),
    filters: validateFilters(options.filters),
    mappers: validateMappers(options.mappers)
  };

  const screenreader = instantiateScreenReader(finalOptions);

  const stop = await screenreader.start();

  if (finalOptions.waitForStable) {
    return await tryStopScreenReader(finalOptions.waitForStable);
  }

  return function stopScreenReader(): Promise<string> {
    return tryStopScreenReader();
  };

  async function tryStopScreenReader(waitForStable?: boolean): Promise<string> {
    try {
      return await stop(waitForStable);
    } finally {
      reading = false;
    }
  }
}
