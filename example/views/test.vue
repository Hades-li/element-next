<template>
  <h3>Test</h3>
  <el-row>
    <el-col :span="12">
      <test>
        123
      </test>
      <test2
        v-for="(item, index) in arrayNum"
        :key="index"
        @click="del(index)"
      >
        {{ item }}
      </test2>
    </el-col>
  </el-row>
</template>

<script>
import {ref, onUpdated, getCurrentInstance} from 'vue'
import Test from 'packages/test'
import Test2 from 'packages/test/src/test2'

export default {
  name: '',
  components: {
    Test,
    Test2
  },
  setup() {
    const arrayNum = ref([
      '1', '2', '3'
    ])

    function del(index) {
      arrayNum.value.splice(index, 1)
    }


    return {
      arrayNum,
      del
    }
  }
}
</script>
