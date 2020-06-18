<template>
  <div class="radio">
    <h3>radio</h3>
    <el-radio-group v-model="radio"></el-radio-group>
  </div>
</template>

<script>
import {ref} from 'vue'

export default {
  name: 'Radio',
  setup() {
    const radio = ref('1')
    return {
      radio
    }
  }
}
</script>

<style scoped>

</style>
