onmessage=e=>postMessage(!Atomics.wait(...e.data))
