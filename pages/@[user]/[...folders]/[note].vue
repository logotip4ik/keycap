<template>
  <div>contents of the note {{ $route.params.note }}

    <pre>
      {{ JSON.stringify($route.params) }}
    </pre>
  </div>
</template>
