<template>
  <h3>Test</h3>
  <el-row>
    <el-col :span="12">
      <test
        v-for="index in arrayNum"
        :key="index"
        @click="del(index)"
      >
        hello test~!({{ index }})
      </test>
    </el-col>
    <el-col :span="12">
      <test2
        v-for="index in arrayNum"
        :key="index"
        @click="del(index)"
      >
        hello test~!({{ index }})
      </test2>
    </el-col>
  </el-row>
</template>

<script>
  import {ref, onUpdated, getCurrentInstance} from 'vue'
  import Test from 'packages/test/src/test'
  import Test2 from 'packages/test/src/test2'

  export default {
    name: 'Test',
    components: {
      Test,
      Test2
    },
    setup() {
      const arrayNum = ref([
        '一','二','三'
      ])
      function del(index) {
        arrayNum.value.splice(arrayNum.value.indexOf(index), 1)
      }
      return {
        arrayNum,
        del
      }
    }
  }
</script>

<style scoped>

</style>
