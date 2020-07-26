<template>
  <h3>Test</h3>
  <div>
    <test>hello test~!</test>
  </div>
</template>

<script>
  import {ref, onUpdated, getCurrentInstance} from 'vue'
  import Test from 'packages/test'

  export default {
    name: 'Test',
    components: {
      Test
    }
  }
</script>

<style scoped>

</style>
