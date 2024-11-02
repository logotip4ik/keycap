import type { H3Event, H3EventContext } from 'h3';

interface TimerPoint {
  name: string
  start: number
  desc?: string
}

class Timer {
  #timersStack: Array<TimerPoint> = [];
  #results = '';

  start(name: string, desc?: string) {
    if (import.meta.dev && name.includes(' ')) {
      console.warn('timer name should not contain a whitespace');
      name = name.replace(/\s/g, '-');
    }

    this.#timersStack.push({
      name,
      desc,
      start: performance.now(),
    });
  }

  end(name?: string) {
    let timer: TimerPoint;

    if (this.#timersStack.length === 0) {
      return;
    }

    if (name) {
      if (import.meta.dev) {
        name = name.replace(/\s/g, '-');
      }

      const timerIdx = this.#timersStack.findIndex((timer) => timer.name === name);

      if (timerIdx === -1) {
        return;
      }

      timer = this.#timersStack.splice(timerIdx, 1)[0];
    }
    else {
      timer = this.#timersStack.pop()!;
    }

    if (this.#results.length > 0) {
      this.#results += ',';
    }

    const dur = performance.now() - timer.start;
    this.#results += timer.desc
      ? `${timer.name};desc=${timer.desc};dur=${dur}`
      : `${timer.name};dur=${dur}`;
  }

  getResults() {
    return this.#results;
  }

  appendHeader(event: H3Event) {
    appendHeader(event, 'Server-Timing', this.getResults());

    this.#results = '';
    this.#timersStack.length = 0;
  }
}

export function createTimer() {
  return new Timer();
}

export function requireTimerFromEvent(event: H3Event): NonNullable<H3EventContext['timer']> {
  const timer = event.context.timer;

  invariant(timer, 'Timer must be defined');

  return timer;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('server timers', () => {
    it('starts and ends named timers', () => {
      const timer = createTimer();

      timer.start('first');
      timer.start('second');

      timer.end('first');

      let results = timer.getResults();

      expect(results).include('first');
      expect(results).not.include('second');
      expect(results).not.include(',');

      timer.end('second');

      results = timer.getResults();

      expect(results).include('first');
      expect(results).include('second');
      expect(results).include(',');
    });

    it('stack behavior', () => {
      const timer = createTimer();

      timer.start('first');
      timer.start('second');

      timer.end();

      let results = timer.getResults();

      expect(results).not.include('first');
      expect(results).include('second');
      expect(results).not.include(',');

      timer.end();

      results = timer.getResults();

      expect(results).include('first');
      expect(results).include('second');
      expect(results).include(',');
    });
  });
}
