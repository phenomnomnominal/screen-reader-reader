export class SRRError extends Error {
  public details: Array<unknown>;

  constructor(public code: ErrorCodes, ...details: Array<unknown>) {
    super();

    this.details = details;
  }
}

export function logError(err: SRRError): void {
  process.stderr.write(ERROR_MESSAGES[err.code](...err.details));
}

const FATAL_ERROR = `
If you see this, something is really wrong!
Please create an issue at https://github.com/phenomnomnominal/screen-reader-reader! ❤️
`;

const CONFIG_ERROR = `
If you see this, you may have an issue with your config!
`;

const TEST_ERROR = `
If you see this, you may have an issue with your setup!
`;

type ErrorMessageFactory = (...details: Array<unknown>) => string;
const ERROR_MESSAGES: Record<ErrorCodes, ErrorMessageFactory> = {
  [ErrorCodes.NOT_IMPLEMENTED]: (methodName: unknown): string => `
${FATAL_ERROR}
  Oops, "${methodName}" is not implemented!

`,

  [ErrorCodes.INVALID_SCREENREADER_NAME]: (
    name: unknown,
    possibleNames: unknown
  ): string => `
${CONFIG_ERROR}
"${name}" is not a valid value for \`screenreader\`!
Valid values for \`screenreader\` are:

  "${(possibleNames as Array<string>).join(', ')}"
    
`,
  [ErrorCodes.INVALID_POLL_TIMEOUT]: (pollTimeout: unknown): string => `
${CONFIG_ERROR}
"${pollTimeout}" is not a valid value for \`pollTimeout\`!
Valid values for \`pollTimeout\` are:

  Any number greater than \`100\`.

`,
  [ErrorCodes.INVALID_STABLE_TIMEOUT]: (stableTimeout: unknown): string => `  
${CONFIG_ERROR}
"${stableTimeout}" is not a valid value for \`stableTimeout\`!
Valid values for \`stableTimeout\` are:

  Any number greater than \`0\`.

`,
  [ErrorCodes.INVALID_WAIT_FOR_STABLE]: (waitForStable: unknown): string => `
${CONFIG_ERROR}
"${waitForStable}" is not a valid value for \`waitForStable\`!
Valid values for \`waitForStable\` are:

  \`true\` or \`false\`

`,
  [ErrorCodes.INVALID_FILTERS]: (filters: unknown): string => `
${CONFIG_ERROR}
  "${filters}" is not a valid value for \`filters\`!
  \`filters\` must be an Array.

`,
  [ErrorCodes.INVALID_FILTER]: (filter: unknown): string => `
${CONFIG_ERROR}
  "${filter}" is not a valid filter!
  Each filter must be a RegExp.

`,
  [ErrorCodes.INVALID_MAPPERS]: (mappers: unknown): string => `
${CONFIG_ERROR}
  "${mappers}" is not a valid value for \`mappers\`!
  \`mappers\` must be an Array.
 
`,
  [ErrorCodes.INVALID_MAPPER]: (mapper: unknown): string => `
${CONFIG_ERROR}
"${mapper}" is not a valid mapper!
Each mapper must be with this type signature:

  (str: string) => string

`,

  [ErrorCodes.NO_SCREENREADER_OUTPUT]: (): string => `
${TEST_ERROR}
There was no recorded screen-reader output!

This could mean:

  ✨There really was no output - was that intentional?
  ✨Something isn't working correctly - does the screen-reader show output when run manually?

`,
  [ErrorCodes.CANT_DETECT_SCREENREADER]: (): string => `
${TEST_ERROR}
Couldn't automatically detect which screen-reader to start!

screen-reader-reader tries to automatically choose a screen-reader for you, based on the following:

  ⭐️ "VoiceOver" - if you are running MacOS.
  ⭐️ "NVDA" - if you are running Windows with NVDA installed in the default directory.

`,
  [ErrorCodes.CANT_START_WHILE_STARTED]: (): string => `
${TEST_ERROR}
You can't start screen-reader-reader again while it is already running!

`
};

export const enum ErrorCodes {
  NOT_IMPLEMENTED,

  INVALID_SCREENREADER_NAME,
  INVALID_POLL_TIMEOUT,
  INVALID_STABLE_TIMEOUT,
  INVALID_WAIT_FOR_STABLE,
  INVALID_FILTERS,
  INVALID_FILTER,
  INVALID_MAPPERS,
  INVALID_MAPPER,

  NO_SCREENREADER_OUTPUT,
  CANT_DETECT_SCREENREADER,
  CANT_START_WHILE_STARTED
}
