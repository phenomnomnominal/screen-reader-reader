import { instantiateScreenReader } from './get-screenreader';
import { Options, getOptions } from './options';

let reading = false;

export async function startScreenReader(
  options: Partial<Options> & { waitForStable: true }
): Promise<string>;

export async function startScreenReader(
  options: Partial<Options> & { waitForStable?: false }
): Promise<() => Promise<string>>;

export async function startScreenReader(
  options: Partial<Options>
): Promise<string | (() => Promise<string>)> {
  if (reading) {
    throw new Error(
      'You can only have one screen reader reader running at a time'
    );
  }

  reading = true;

  const finalOptions = getOptions(options);

  const screenreader = instantiateScreenReader(finalOptions);

  const stop = await screenreader.start();

  if (finalOptions.waitForStable) {
    return await stopScreenReader(finalOptions.waitForStable);
  }

  return function(): Promise<string> {
    return stopScreenReader();
  };

  async function stopScreenReader(waitForStable?: boolean): Promise<string> {
    try {
      return await stop(waitForStable);
    } finally {
      reading = false;
    }
  }
}
