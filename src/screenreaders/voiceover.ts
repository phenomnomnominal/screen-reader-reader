import { SRRError, ErrorCodes } from '../errors';
import { poll, UpdateStable } from '../poller';
import { runScript, cleanUp } from '../run-script';
import { ScreenReader, Stop } from './screenreader';

const DEFAULT_FILTERS = [
  /\./,
  /!/,
  /null/,
  /VoiceOver off/,
  /You are currently on a .*/,
  /.* has new window/
];

export class VoiceOver extends ScreenReader {
  private _lastText = '';
  private _screenreaderOutput: Array<string> = [];

  public async start(): Promise<Stop> {
    this._lastText = '';
    this._screenreaderOutput = [];

    await this._toggle();

    const clear = poll(this._options, updateStable => {
      this._pollScreenReader(updateStable);
    });

    return async (waitForStable?: boolean): Promise<string> => {
      await clear(waitForStable);

      await this._toggle();

      await cleanUp();

      const filters = [...this._options.filters, ...DEFAULT_FILTERS];
      const mappers = this._options.mappers;
      const result = this._screenreaderOutput
        .filter(Boolean)
        .map(text => mappers.reduce((p, n) => n(p), text))
        .filter(text => !filters.some(filter => filter.test(text)))
        .join(' ');

      if (result.length === 0) {
        throw new SRRError(ErrorCodes.NO_SCREENREADER_OUTPUT);
      }

      return result;
    };
  }

  private async _toggle(): Promise<string | null> {
    return runScript('voiceover/toggle-voiceover.js');
  }

  private async _pollScreenReader(updateStable: UpdateStable): Promise<void> {
    const text = await runScript('voiceover/get-voiceover-text.js');
    if (text === null) {
      return;
    }
    const trimmedText = text.trim();
    if (trimmedText !== this._lastText) {
      this._screenreaderOutput.push(trimmedText);
      this._lastText = trimmedText;
      updateStable();
    }
  }

  static detect(): boolean {
    return process.platform === 'darwin';
  }
}
