<template>
  <div>
    test:
    <slot />
  </div>
</template>
<script>
  import {ref,h, Transition} from 'vue'
  export default {
    setup(props,ctx) {

    },
    /*render() {
      return h('div', this.$slots.default())
    }*/
  }
</script>
