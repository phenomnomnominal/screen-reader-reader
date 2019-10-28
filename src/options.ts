import { ScreenReaderName, getScreenReaderName } from './get-screenreader';

export type Options = {
  screenreader: ScreenReaderName;
  pollTimeout: number;
  stableTimeout: number;
  waitForStable: boolean;
  filters: Array<RegExp>;
  mappers: Array<(t: string) => string>;
};

const DEFAULT_POLL_TIMEOUT = 100;
const DEFAULT_STABLE_TIMEOUT = 10000;

export function getOptions(options: Partial<Options>): Options {
  return {
    screenreader: getScreenReaderName(options.screenreader),
    pollTimeout:
      options.pollTimeout != null ? options.pollTimeout : DEFAULT_POLL_TIMEOUT,
    stableTimeout:
      options.stableTimeout != null
        ? options.stableTimeout
        : DEFAULT_STABLE_TIMEOUT,
    waitForStable: options.waitForStable || false,
    filters: options.filters || [],
    mappers: options.mappers || []
  };
}
