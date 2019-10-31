import { Options } from '../options';
import { SRRError, ErrorCodes } from '../errors';

export type Stop = (waitForStable?: boolean) => Promise<string>;

export class ScreenReader {
  constructor(protected _options: Options) {}

  start(): Promise<Stop> {
    return Promise.reject(new SRRError(ErrorCodes.NOT_IMPLEMENTED, 'start'));
  }

  static detect(): boolean | Promise<boolean> {
    return Promise.reject(new SRRError(ErrorCodes.NOT_IMPLEMENTED, 'detect'));
  }
}
