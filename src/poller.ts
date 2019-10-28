import { Options } from './options';

export type UpdateStable = () => void;
export type Work = (updateStable: UpdateStable) => void;
export type Stop = (waitForStable?: boolean) => Promise<void>;

export function poll(options: Options, work: Work): Stop {
  const { stableTimeout, pollTimeout } = options;

  const stop = createStop();

  let keepPolling: NodeJS.Timeout | null = null;
  updateStableTimeout();

  const polling = runPoll();

  return stop;

  function createStop(): Stop {
    return async (waitForStable = false): Promise<void> => {
      if (waitForStable !== true) {
        keepPolling = null;
      }
      await polling;
    };
  }

  async function runPoll(): Promise<void> {
    while (keepPolling !== null) {
      work(updateStableTimeout);
      await delay(pollTimeout);
    }
  }

  function updateStableTimeout(): void {
    if (keepPolling) {
      clearTimeout(keepPolling);
    }
    keepPolling = setTimeout(() => {
      keepPolling = null;
    }, stableTimeout);
  }
}

function delay(time: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}
