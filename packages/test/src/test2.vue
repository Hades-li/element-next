<template>
  <transition name="fade">
    <div class="test">
      test:<slot></slot>
    </div>
  </transition>
</template>
<script>
  import {ref,h, Transition} from 'vue'
  export default {
    /*setup(props, ctx) {
      return () => h('div', ctx.slots.default())
    },*/
  }
</script>
