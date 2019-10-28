import * as path from 'path';
import { existsSync } from 'fs';

import { NVDA } from './screenreaders/nvda';
import { VoiceOver } from './screenreaders/voiceover';
import { Options } from './options';

export type ScreenReader = NVDA | VoiceOver;

export const enum ScreenReaderName {
  voiceover,
  nvda
}

const DEFAULT_NDVA_PATH = path.join(
  'C:/',
  'Program Files (x86)',
  'NVDA',
  'nvda.exe'
);

export type ScreenReaderConstructor = (options: Options) => ScreenReader;

const CONSTRUCTORS: Record<ScreenReaderName, ScreenReaderConstructor> = {
  [ScreenReaderName.nvda]: (options: Options) => new NVDA(options),
  [ScreenReaderName.voiceover]: (options: Options) => new VoiceOver(options)
};

export function getScreenReaderName(
  screenReader?: string | ScreenReaderName
): ScreenReaderName {
  if (typeof screenReader === 'string') {
    if (screenReader.toLowerCase() === 'nvda') {
      return ScreenReaderName.nvda;
    }
    if (screenReader.toLowerCase() === 'voiceover') {
      return ScreenReaderName.voiceover;
    }

    throw new Error(`
"${screenReader}" is not a valid screen reader name. Valid options are:

  * "VoiceOver"
  * "NVDA"
    `);
  }

  if (screenReader) {
    return screenReader;
  }

  if (process.platform === 'darwin') {
    return ScreenReaderName.voiceover;
  }
  if (existsSync(DEFAULT_NDVA_PATH)) {
    return ScreenReaderName.nvda;
  }

  throw new Error(`
Could not automatically detect screen reader.
Default for MacOS is "VoiceOver".
Default for Windows is "NVDA" which must installed at "${DEFAULT_NDVA_PATH}".
  `);
}

export function instantiateScreenReader(options: Options): ScreenReader {
  return CONSTRUCTORS[options.screenreader](options);
}
