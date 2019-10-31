import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

type ProcessHandler = {
  child: ChildProcess;
  dead: Promise<unknown>;
};

type Resolve = Parameters<ConstructorParameters<typeof Promise>[0]>[0];

const HANDLERS: Array<ProcessHandler> = [];

export function runScript(
  command: string,
  arg?: string
): Promise<string | null> {
  const child = arg
    ? spawn(command, [getScriptPath(arg)])
    : spawn(getScriptPath(command));

  let done: Resolve;
  const dead = new Promise(resolve => {
    done = resolve;
  });
  HANDLERS.push({ child, dead });

  return new Promise((resolve): void => {
    let data = '';
    child.stdout.on('data', str => (data += str));
    child.on('exit', code => {
      done();
      if (code != null && code !== 0) {
        resolve(null);
      }
      resolve(data);
    });
  });
}

export async function cleanUp(): Promise<void> {
  HANDLERS.forEach(handler => handler.child.kill());
  await Promise.all(HANDLERS.map(handler => handler.dead));
  HANDLERS.splice(0, HANDLERS.length);
}

function getScriptPath(scriptName: string): string {
  return path.resolve(__dirname, `../scripts/${scriptName}`);
}
