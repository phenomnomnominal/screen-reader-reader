import { startScreenReader } from '../src/index';
import { detectScreenReader, ScreenReaderName } from '../src/screenreaders';

const REALLY_BIG_TIMEOUT = 1000000;

describe('screen-reader-reader', () => {
  const screenreader = detectScreenReader();
  describe(ScreenReaderName[screenreader], () => {
    [
      { url: 'https://www.google.com' },
      {
        url: 'https://www.typescriptlang.org/',
        stableTimeout: 30000,
        filters: [/!/],
        mappers: [(t: string): string => t.replace(/\d{5,}/g, 'REPLACED')]
      },
      { url: 'https://www.apple.com/voiceover/info/guide/_1121.html' },
      {
        url: 'https://jestjs.io/en/help',
        filters: [/link \d+ stargazers on Github/]
      }
    ].forEach(({ url, stableTimeout, filters, mappers }) => {
      it(`should get the  output for some web pages: ${url}`, async () => {
        jest.setTimeout(REALLY_BIG_TIMEOUT);

        await page.goto(url);

        const result = await startScreenReader({
          waitForStable: true,
          screenreader,
          stableTimeout,
          filters,
          mappers
        });

        expect(result).toMatchSnapshot();
      });
    });
  });
});
