import { spawn, ChildProcess } from 'child_process';

type ProcessHandler = {
  child: ChildProcess;
  dead: Promise<void>;
};
const HANDLERS: Array<ProcessHandler> = [];

export function runScript(
  command: string,
  ...args: Array<string>
): Promise<string | null> {
  const child = spawn(command, args);
  let done: Function;
  const dead = new Promise<void>(resolve => {
    done = resolve;
  });
  HANDLERS.push({ child, dead });

  return new Promise((resolve): void => {
    let data = '';
    let err = '';
    child.stdout.on('data', str => (data += str));
    child.stderr.on('data', str => (err += str));
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
