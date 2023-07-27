import type { H3Event } from 'h3';

interface TimerPoint { name: string; desc?: string; start: number }

class Timer {
  #timersStack: TimerPoint[] = [];
  #results = '';

  start(name: string, desc?: string) {
    name = name.replace(/\s/g, '-');

    this.#timersStack.push({
      name,
      desc,
      start: performance.now(),
    });
  }

  end(name?: string) {
    let timer: TimerPoint;

    if (name) {
      name = name.replace(/\s/g, '-');

      const timerIdx = this.#timersStack.findIndex((timer) => timer.name === name);

      if (timerIdx === -1)
        return;

      timer = this.#timersStack.splice(timerIdx, 1)[0];
    }
    else {
      if (this.#timersStack.length === 0)
        return;

      timer = this.#timersStack.pop()!;
    }

    const result = [
      timer.name,
      timer.desc && `desc="${timer.desc}"`,
      `dur=${performance.now() - timer.start}`,
    ].filter(Boolean);

    if (this.#results.length !== 0)
      this.#results += ',';

    this.#results += result.join(';');
  }

  getResults() {
    return this.#results;
  }

  appendHeader(event: H3Event) {
    appendHeader(event, 'Server-Timing', this.getResults());

    this.#timersStack = [];
    this.#results = '';
  }
}

export function createTimer() {
  return new Timer();
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
