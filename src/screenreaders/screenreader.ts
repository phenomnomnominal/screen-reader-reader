import { Options } from '../options';

export type Stop = (waitForStable?: boolean) => Promise<string>;

export abstract class ScreenReader {
  constructor(protected _options: Options) {}

  abstract async start(): Promise<Stop>;
}
