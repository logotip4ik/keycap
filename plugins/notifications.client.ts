const Toaster = init();

export default defineNuxtPlugin(() => {
  return {
    provide: {
      toaster: Toaster,
      createToast: Toast,
    },
  };
});

function createToast(text: string) {
  const node = document.createElement('output');

  node.innerText = text;
  node.classList.add('notification');
  node.setAttribute('role', 'status');
  node.setAttribute('aria-live', 'polite');

  return node;
}

function addToast(toast: HTMLElement) {
  const { matches: motionOK } = window.matchMedia(
    '(prefers-reduced-motion: no-preference)',
  );

  Toaster.children.length && motionOK
    ? flipToast(toast)
    : Toaster.appendChild(toast);
}

interface ToastOptions {
  /**
   * in milliseconds
   */
  duration: number
}

function Toast(text: string): Promise<void> {
  const toast = createToast(text);
  addToast(toast);

  return new Promise((resolve) => {
    Promise.allSettled(
      toast.getAnimations().map((animation) => animation.finished),
    ).then(() => {
      Toaster.removeChild(toast);

      resolve();
    });
  });
}

// https://aerotwist.com/blog/flip-your-animations/
function flipToast(toast: HTMLElement) {
  // FIRST
  const first = Toaster.offsetHeight;

  // add new child to change container size
  Toaster.appendChild(toast);

  // LAST
  const last = Toaster.offsetHeight;

  // INVERT
  const invert = last - first;

  // PLAY
  const animation = Toaster.animate([
    { transform: `translateY(${invert}px)` },
    { transform: 'translateY(0)' },
  ], {
    duration: 150,
    easing: 'ease-out',
  });

  animation.startTime = document.timeline.currentTime;
}

function init() {
  const node = document.createElement('section');
  node.classList.add('notifications-wrapper');

  document.firstElementChild?.insertBefore(node, document.body);

  return node;
}
