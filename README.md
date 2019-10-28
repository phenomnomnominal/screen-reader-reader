# screen-reader-reader

[![npm version](https://img.shields.io/npm/v/screen-reader-reader.svg)](https://img.shields.io/npm/v/screen-reader-reader.svg)

This is a very experimental attempt at creating a general purpose screen reader reader, with the aim of enabling more realistic end-to-end accessibility tests!

The goal would be to have something like this:

```ts
describe('my website', () => {
  it(`should have correct screen reader output`, async () => {
    await page.goto('https://www.my-website.com');

    const result = await startScreenReader({
      waitForStable: true
    });

    expect(result).toMatchSnapshot();
  });
});
```

This is _very_ much a work in progress! I would love your help to make this more stable!

## Currently working

- Turning on VoiceOver (Mac OS), reading VoiceOver output as text, tunring off VoiceOver.
- Turning on NVDA (Windows), reading NVDA output as text, turning off NVDA.

## Goals

- More stability. There is some unexpected behaviour when running the tests with Puppeteer that I'm sure people with more screen reader experience will be able to explain.
- More screen readers. It would be good to get this working with JAWS and other commonly used screen readers.
- Other things?

## Installation

```sh
npm install screen-reader-reader --save-dev
```

## Usage

### CLI

There is a very basic CLI. It will enable the given screen reader (or automatically detect one), and read the screen reader output until it is stable.

```sh
screen-reader-reader
```

### JavaScript

When using the API from JavaScript, there are two distinct modes:

#### Stable mode

```js
const result = await startScreenReader({
  waitForStable: true
});

console.log(result);
```

#### Manual mode

```js
const stop = await startScreenReader();

// Do whatever you want to do...

const result = await stop();
```

#### Options

The `startScreenReader` function takes a number of options:

```ts
type Options = {
  screenreader: ScreenReaderName; // Default = from local environment
  pollTimeout: number; // Default = 100ms
  stableTimeout: number; // Default = 10000ms
  waitForStable: boolean; // Default = false
  filters: Array<RegExp>; // Default = []
  mappers: Array<(t: string) => string>; // Default = []
};

const enum ScreenReaderName {
  voiceover,
  nvda
}
```
