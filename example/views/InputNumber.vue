<template>
  <h3>inputNumber</h3>
  <h3>基础用法</h3>
  <div>
    <el-input-number
      v-model="num"
      :min="1"
      :max="10"
      label="描述文字"
      @change="handleChange"
    />
  </div>
  <h3>尺寸</h3>
  <div>
    <el-input-number size="medium" v-model="num2"></el-input-number>
    <el-input-number size="small" v-model="num3"></el-input-number>
    <el-input-number size="mini" v-model="num4"></el-input-number>
  </div>
  <h3>按钮位置</h3>
  <div>
    <el-input-number v-model="num" controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>

  </div>
</template>

<script>
  import {ref, watch} from 'vue'
  export default {
    name: "InputNumber",
    data() {
      return {
        currentValue: 0
      }
    },
    mounted() {
      console.log(this.currentValue)
    },
    setup() {
      const num = ref(1)
      const num1 = ref(1)
      const num2 = ref(1)
      const num3 = ref(0)
      const num4 = ref(0)
      function handleChange(value) {
        console.log(value);
      }
      return {
        num,
        num1,
        num2,
        num3,
        num4,
        handleChange
      }
    }
  }
</script>

<style lang="scss">

</style>
