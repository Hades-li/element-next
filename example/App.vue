<template>
  <img src="./logo.png">
  <h1>Hello Vue 3!</h1>
  <button @click="inc">Clicked {{ count }} times.</button>
</template>

<script>
import { ref } from 'vue'

export default {
  setup(props, ctx) {
    const count = ref(0)
    const inc = () => {
      count.value++
    }
    console.log(ctx)

    return {
      count,
      inc
    }
  }
}
</script>

<style scoped>
img {
  width: 200px;
}
h1 {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
