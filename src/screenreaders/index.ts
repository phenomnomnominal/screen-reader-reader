export * from './screenreader-names';

import { ScreenReader } from './screenreader';
import { ScreenReaderName } from './screenreader-names';
import { NVDA } from './nvda';
import { VoiceOver } from './voiceover';
import { Options } from '../options';
import { SRRError, ErrorCodes } from '../errors';

const DETECTORS = new Map<typeof ScreenReader, ScreenReaderName>([
  [NVDA, ScreenReaderName.nvda],
  [VoiceOver, ScreenReaderName.voiceover]
]);

export function detectScreenReader(): ScreenReaderName {
  const match = Array.from(DETECTORS.keys()).find(screenreader => {
    return screenreader.detect();
  });
  const screenreader = match && DETECTORS.get(match);
  if (screenreader != null) {
    return screenreader;
  }
  throw new SRRError(ErrorCodes.CANT_DETECT_SCREENREADER);
}

const CONSTRUCTORS: Record<ScreenReaderName, typeof ScreenReader> = {
  [ScreenReaderName.nvda]: NVDA,
  [ScreenReaderName.voiceover]: VoiceOver
};

export function instantiateScreenReader(options: Options): ScreenReader {
  return new CONSTRUCTORS[options.screenreader](options);
}
