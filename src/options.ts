import { SRRError, ErrorCodes } from './errors';
import {
  detectScreenReader,
  ScreenReaderName,
  screenReaderNames,
  stringToScreenReaderName
} from './screenreaders';

export type UnknownOptions = Record<string, unknown>;

export type Mapper = (t: string) => string;

export type Options = {
  waitForStable: boolean;
  screenreader: ScreenReaderName;
  pollTimeout: number;
  stableTimeout: number;
  filters: Array<RegExp>;
  mappers: Array<Mapper>;
};

const DEFAULT_WAIT_FOR_STABLE = false;
const DEAFULT_SCREENREADER = detectScreenReader();
const DEFAULT_POLL_TIMEOUT = 100;
const DEFAULT_STABLE_TIMEOUT = 10000;
const DEFAULT_FILTERS: Array<RegExp> = [];
const DEFAULT_MAPPERS: Array<Mapper> = [];

export function validateScreenReaderName(
  screenReader?: unknown
): ScreenReaderName {
  if (screenReader == null) {
    return DEAFULT_SCREENREADER;
  }
  if (
    !is.str(screenReader) ||
    !screenReaderNames.includes(screenReader.toLowerCase())
  ) {
    throw new SRRError(
      ErrorCodes.INVALID_SCREENREADER_NAME,
      screenReader,
      screenReaderNames
    );
  }
  if (!is.str(screenReader)) {
    return screenReader;
  }
  return stringToScreenReaderName(screenReader);
}

export function validatePollTimeout(pollTimeout?: unknown): number {
  if (pollTimeout == null) {
    return DEFAULT_POLL_TIMEOUT;
  }
  if (!is.num(pollTimeout)) {
    throw new SRRError(ErrorCodes.INVALID_POLL_TIMEOUT, pollTimeout);
  }
  return Math.max(pollTimeout, DEFAULT_POLL_TIMEOUT);
}

export function validateStableTimeout(stableTimeout?: unknown): number {
  if (stableTimeout == null) {
    return DEFAULT_STABLE_TIMEOUT;
  }
  if (!is.num(stableTimeout)) {
    throw new SRRError(ErrorCodes.INVALID_STABLE_TIMEOUT, stableTimeout);
  }
  return Math.max(stableTimeout, 0);
}

export function validateWaitForStable(waitForStable?: unknown): boolean {
  if (waitForStable == null) {
    return DEFAULT_WAIT_FOR_STABLE;
  }
  if (!is.boo(waitForStable)) {
    throw new SRRError(ErrorCodes.INVALID_WAIT_FOR_STABLE, waitForStable);
  }
  return waitForStable;
}

export function validateFilters(filters?: unknown): Array<RegExp> {
  if (filters == null) {
    return DEFAULT_FILTERS;
  }
  if (!is.arr(filters)) {
    throw new SRRError(ErrorCodes.INVALID_FILTERS, filters);
  }
  return filters.map(filter => {
    try {
      return new RegExp(filter as string);
    } catch {
      throw new SRRError(ErrorCodes.INVALID_FILTER, filter);
    }
  });
}

export function validateMappers(mappers?: unknown): Array<Mapper> {
  if (mappers == null) {
    return DEFAULT_MAPPERS;
  }
  if (!is.arr(mappers)) {
    throw new SRRError(ErrorCodes.INVALID_MAPPERS, mappers);
  }
  return mappers.map(mapper => {
    if (!is.fun(mapper)) {
      throw new SRRError(ErrorCodes.INVALID_MAPPER, mapper);
    }
    return mapper as Mapper;
  });
}

function is<T>(t: T, obj: unknown): obj is T {
  return typeof obj === typeof t;
}

is.str = (obj: unknown): obj is string => is('', obj);
is.num = (obj: unknown): obj is number => is(0, obj);
is.boo = (obj: unknown): obj is boolean => is(true, obj);
is.fun = (obj: unknown): obj is Function => is((): void => void 0, obj);
is.arr = (obj: unknown): obj is Array<unknown> => Array.isArray(obj);
