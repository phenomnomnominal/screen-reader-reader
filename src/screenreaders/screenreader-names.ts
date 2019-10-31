export enum ScreenReaderName {
  voiceover,
  nvda
}

export const screenReaderNames = Object.keys(ScreenReaderName).filter(n =>
  Number.isNaN(parseInt(n))
);

export function stringToScreenReaderName(str: string): ScreenReaderName {
  return ScreenReaderName[str as keyof typeof ScreenReaderName];
}
