import type { H3Event } from 'h3';

export function createTimer() {
  let timers: Record<string, number> = {};
  let results: [string, number][] = [];
  let prevTimerName: string;

  return {
    start: (name: string) => {
      prevTimerName = name;
      timers[name] = performance.now();
    },

    end: (name?: string) => {
      const timerName = name || prevTimerName;

      const diff = performance.now() - timers[timerName];

      if (!name) prevTimerName = '';

      results.push([timerName, diff]);
    },

    appendHeader: (event: H3Event) => {
      const headerValue = results.map((timer) => `${timer[0]};dur=${timer[1]}`, '').join(', ');

      appendHeader(event, 'Server-Timing', headerValue);

      timers = {};
      results = [];
    },
  };
}
