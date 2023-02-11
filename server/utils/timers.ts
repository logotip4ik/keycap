import type { H3Event } from 'h3';

export function createTimer() {
  let timers: Record<string, number> = {};
  const timersStack: string[] = [];

  interface Result { name: string; desc?: string; duration: number }
  let results: Result[] = [];

  return {
    start: (name: string) => {
      timersStack.push(name);
      timers[name] = performance.now();
    },

    end: (name?: string, desc?: string) => {
      let timerName: string | undefined;

      if (name) {
        const timerIdx = timersStack.findIndex((timerName) => timerName === name);

        if (timerIdx < 0) return;

        timerName = timersStack.splice(timerIdx, 1)[0];
      }
      else {
        timerName = timersStack.pop();
      }

      if (!timerName) return;

      const diff = performance.now() - timers[timerName];

      results.push({ name: timerName, desc, duration: diff });
    },

    appendHeader: (event: H3Event) => {
      const headerValue = results.map(({ name, desc, duration }) =>
        desc
          ? `${name};desc="${desc}";dur=${duration}`
          : `${name};dur=${duration}`)
        .join(', ');

      appendHeader(event, 'Server-Timing', headerValue);

      timers = {};
      results = [];
    },
  };
}
