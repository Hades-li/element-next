<template>
  <div v-show="visible">
    1235
  </div>
  <button @click="visible = !visible">
    点击
  </button>
</template>

<script>
export default {
  name: 'Test',
  setup(props, ctx) {
    const visible = ref(false)
    return {
      visible
    }
  }
}
</script>

<style scoped>

</style>
