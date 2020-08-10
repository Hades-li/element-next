<template>
  <transition name="el-zoom-in-center">
    <div
      v-if="show"
      class="test"
      @click="handle"
    >
      test:
      <slot />
    </div>
  </transition>
</template>
<script>
import {ref, h, onBeforeUnmount} from 'vue'

export default {
  emits: ['close'],
  setup(props, ctx) {
    const show = ref(true)
    onBeforeUnmount(() => {
      show.value = false
    })

    function handle() {
      show.value = false
      ctx.emit('close')
    }

    return {
      show,
      handle
    }
  },
}
</script>
