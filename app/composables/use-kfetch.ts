import type { Promisable } from 'type-fest';
import type { WatchSource } from 'vue';

interface KFetch<TData> {
  pollingTime: number
  deep?: boolean
  skip?: Ref<boolean>
  watch?: Array<WatchSource>
  getLoadingToast?: (c: { hasCachedItem: boolean }) => ToastInstance
  getSuccessToast?: () => ToastInstance
  getErrorToast?: () => ToastInstance
  onResponse?: (r: TData) => Promisable<void>
  getCached: (c: { inErrorBlock: boolean }) => Promisable<TData | undefined>
}

export function useKFetch<TData>(path: MaybeRefOrGetter<string>, {
  deep,
  pollingTime,
  skip,
  watch: watchSources,
  getLoadingToast,
  getSuccessToast,
  getErrorToast,
  onResponse,
  getCached,
}: KFetch<TData>) {
  if (import.meta.server) {
    return {
      data: shallowRef(),
      refresh: () => new Promise((r) => r()),
    } satisfies typeof returnData;
  }

  const isFallbackMode = useFallbackMode();

  let pollingTimer: ReturnType<typeof setTimeout>;
  let abortControllerGet: AbortController | undefined;
  let loadingToastInstance: ToastInstance | undefined;
  let lastFetchState: 'success' | 'error' = 'success';
  let hydrationPromise = getHydrationPromise();

  const _ref = (deep ? ref : shallowRef) as typeof deep extends true ? typeof ref : typeof shallowRef;
  const data = _ref<TData>();
  let lastFetchTime = 0;

  const innerFetch = async () => {
    if (skip && skip.value) {
      return;
    }

    clearTimeout(pollingTimer);

    abortControllerGet?.abort();
    abortControllerGet = new AbortController();

    lastFetchTime = Date.now();

    kfetch<{ data: TData }>(toValue(path), {
      signal: abortControllerGet.signal,
      responseType: 'json',
      headers: { Accept: 'application/json' },
    })
      .then(async (res) => {
        if (!res) {
          return;
        }

        if (hydrationPromise) {
          await hydrationPromise;
          hydrationPromise = undefined;
        }

        const fetchState = lastFetchState;

        isFallbackMode.value = false;
        lastFetchState = 'success';

        onResponse?.(res.data);

        if (getSuccessToast && fetchState === 'error') {
          getSuccessToast();
        }

        data.value = res.data;
      })
      .catch(async (error) => {
        if (await baseHandleError(error)) {
          return;
        }

        const fetchState = lastFetchState;
        lastFetchState = 'error';

        if (data.value) {
          if (getErrorToast && fetchState === 'success') {
            getErrorToast();
          }

          return;
        }

        let cached = getCached({ inErrorBlock: true });
        if (cached instanceof Promise) {
          cached = await cached;
        }

        if (cached) {
          data.value = cached as Awaited<typeof cached>;
        }
      })
      .finally(() => {
        const multiplier = document.visibilityState === 'visible' ? 1 : 2;
        pollingTimer = setTimeout(innerFetch, pollingTime * multiplier);

        loadingToastInstance?.remove();
      });

    if (data.value) {
      return;
    }

    let cached = getCached({ inErrorBlock: false });
    if (cached instanceof Promise) {
      cached = await cached;
    }

    if (hydrationPromise) {
      await hydrationPromise;
      hydrationPromise = undefined;
    }

    loadingToastInstance = getLoadingToast?.({ hasCachedItem: !!cached });

    data.value = cached as Awaited<typeof cached>;
  };

  innerFetch();

  const sources: [() => string, ...Array<WatchSource>] = [() => toValue(path)];
  if (watchSources) {
    sources.push(...watchSources);
  }
  watch(sources, ([path], [oldPath]) => {
    const timeDiff = Date.now() - (lastFetchTime || 0);
    const isDifferentPath = oldPath !== path;

    if (isDifferentPath || !data.value || timeDiff > parseDuration('10 seconds')!) {
      innerFetch();

      if (isDifferentPath) {
        data.value = undefined;
      }
    }
  });

  const offVisibilityChange = on(document, 'visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      return;
    }

    const timeDiff = Date.now() - (lastFetchTime || 0);

    if (timeDiff > parseDuration('15 seconds')!) {
      setTimeout(innerFetch, Math.random() * 10);
    }
  });

  onBeforeUnmount(() => {
    clearTimeout(pollingTimer);
    offVisibilityChange();

    abortControllerGet?.abort();
    loadingToastInstance?.remove();

    abortControllerGet = undefined;
    loadingToastInstance = undefined;
  });

  const returnData = { data, refresh: innerFetch };

  return returnData;
}
