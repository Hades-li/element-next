<template>
  <div class="radio">
    <h3>radio</h3>
    <el-radio-group v-model="radio">
      <el-radio label="1">1</el-radio>
      <el-radio label="2">2</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
import {ref} from 'vue'
import ElRadio from '../../packages/radio/src/radio'

export default {
  name: 'Radio',
  components: { ElRadio },
  setup() {
    const radio = ref('1')
    return {
      radio
    }
  }
}
</script>
