import { startScreenReader } from '../src/index';

const REALLY_BIG_TIMEOUT = 1000000;

describe('screen-reader-reader', () => {
  [
    { url: 'https://www.google.com' },
    {
      url: 'https://www.typescriptlang.org/',
      stableTimeout: 20000,
      filters: [/!/],
      mappers: [(t: string): string => t.replace(/\d{5,}/g, 'REPLACED')]
    },
    { url: 'https://www.apple.com/voiceover/info/guide/_1121.html' },
    {
      url: 'https://jestjs.io/en/help',
      filters: [/link \d+ stargazers on Github/]
    }
  ].forEach(({ url, stableTimeout, filters }) => {
    it(`should get the screen reader output for some web pages: ${url}`, async () => {
      jest.setTimeout(REALLY_BIG_TIMEOUT);

      await page.goto(url);

      const result = await startScreenReader({
        waitForStable: true,
        stableTimeout,
        filters
      });

      expect(result).toMatchSnapshot();
    });
  });
});
