import * as path from 'path';

export function getScriptPath(scriptName: string): string {
  return path.resolve(__dirname, `../scripts/${scriptName}`);
}
