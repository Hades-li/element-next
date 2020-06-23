<template>
  <button @click="pushTo('/')">button</button>
  <button @click="pushTo('/layout')">layout</button>
  <button @click="pushTo('/container')">container</button>
  <button @click="pushTo('/link')">Link</button>
  <button @click="pushTo('/radio')">radio</button>
  <button @click="pushTo('/form')">form</button>
  <h3 ref="root">123</h3>
  <router-view></router-view>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
export default {
  setup(props, ctx) {
    const router = useRouter()
    const pushTo = (path) => {
      router.push(path)
    }
    const root = ref(null)
    onMounted(() => {
      root.value
    })
    return {
      pushTo
    }
  },
  mounted () {
    console.log(this.refs.root)
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
