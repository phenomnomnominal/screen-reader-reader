import { validateScreenReaderName, Options, UnknownOptions } from '../options';
import { ScreenReaderName } from '../screenreaders/screenreader-names';
import { runScript } from '../run-script';

export type SetupOptions = Pick<Options, 'screenreader'>;

export async function setup(options: UnknownOptions): Promise<void> {
  const setupOptions = validateOptions(options);

  if (setupOptions.screenreader === ScreenReaderName.voiceover) {
    await voiceoverSetup();
  }
}

function validateOptions(options: UnknownOptions): SetupOptions {
  return {
    screenreader: validateScreenReaderName(options.screenreader)
  };
}

export async function voiceoverSetup(): Promise<void> {
  await runScript('voiceover/setup.js');
}
