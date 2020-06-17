<template>
  <button @click="pushTo('/')">button</button>
  <button @click="pushTo('/layout')">layout</button>
  <button @click="pushTo('/container')">layout</button>

  <router-view></router-view>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
export default {
  setup(props, ctx) {
    const router = useRouter()
    const pushTo = (path) => {
      router.push(path)
    }
    return {
      pushTo
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
