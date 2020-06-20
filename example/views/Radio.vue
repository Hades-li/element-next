<template>
  <div class="radio">
    <h3>radio</h3>
    <div>
      <el-radio-group v-model="radio">
        <el-radio label="1">1号</el-radio>
        <el-radio label="2">2号</el-radio>
      </el-radio-group>
    </div>
    <div>
      <el-radio-group v-model="radio_2">
        <el-radio label="3">3号</el-radio>
        <el-radio label="4">4号</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import {ref, watchEffect} from 'vue'
import ElRadio from '../../packages/radio/src/radio'

export default {
  name: 'Radio',
  components: { ElRadio },
  setup() {
    const radio = ref('1')
    const radio_2 = ref('3')
    watchEffect(() => {
      console.log('curRadio:' + radio.value)
    })
    watchEffect(() => {
      console.log('curRadio_2:' + radio_2.value)
    })
    return {
      radio,
      radio_2
    }
  }
}
</script>
