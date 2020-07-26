<!--<template>
  <div class="test">
    test:<slot></slot>
  </div>
</template>-->
<script>
  import {ref,h, Transition} from 'vue'
  export default {
    setup(props, ctx) {
      return () => h(Transition, {
        name: 'fade'
      },
        h('div',[ctx.slots.default()])
      )
    },
    /*render() {
      return h('div', this.$slots.default())
    }*/
  }
</script>
