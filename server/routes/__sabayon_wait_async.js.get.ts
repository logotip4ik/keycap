export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'Content-Type': 'text/javascript',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'cross-origin',
  });

  return 'onmessage=e=>postMessage(!Atomics.wait(...e.data))';
});
