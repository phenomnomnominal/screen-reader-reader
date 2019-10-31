import { existsSync } from 'fs';
import * as path from 'path';

import { SRRError, ErrorCodes } from '../errors';
import { poll, UpdateStable } from '../poller';
import { runScript, cleanUp } from '../run-script';
import { ScreenReader, Stop } from './screenreader';

const EXEC_VBSCRIPT = 'cscript';

const DEFAULT_NDVA_PATH = path.join(
  'C:/',
  'Program Files (x86)',
  'NVDA',
  'nvda.exe'
);

const DEFAULT_FILTERS: Array<RegExp> = [];

export class NVDA extends ScreenReader {
  private _screenreaderOutput = '';

  async start(): Promise<Stop> {
    this._screenreaderOutput = '';

    await runScript(EXEC_VBSCRIPT, 'nvda/enable-nvda.vbs');

    const clear = poll(this._options, updateStable => {
      this._pollScreenReader(updateStable);
    });

    return async (waitForStable?: boolean): Promise<string> => {
      await clear(waitForStable);

      await runScript(EXEC_VBSCRIPT, 'nvda/disable-nvda.vbs');

      await cleanUp();

      const filters = [...this._options.filters, ...DEFAULT_FILTERS];
      const result = this._screenreaderOutput
        .split('\n')
        .filter(Boolean)
        .filter(text => !filters.some(filter => filter.test(text)))
        .join(' ');

      if (result.length === 0) {
        throw new SRRError(ErrorCodes.NO_SCREENREADER_OUTPUT);
      }

      return result;
    };
  }

  private async _pollScreenReader(updateStable: UpdateStable): Promise<void> {
    const text = await runScript('nvda/get-nvda-text.exe');
    if (text === null) {
      return;
    }
    const trimmedText = text.trim();
    if (trimmedText !== this._screenreaderOutput) {
      this._screenreaderOutput = trimmedText;
      updateStable();
    }
  }

  static detect(): boolean {
    return existsSync(DEFAULT_NDVA_PATH);
  }
}
