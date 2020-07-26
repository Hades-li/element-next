<template>
  <div class="test">
    test:<slot></slot>
  </div>
</template>
<script>
  export default {
    setup(props, ctx) {
      const text = ctx.slots.default()
      console.log(text)
    }
  }
</script>
