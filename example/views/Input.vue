<template>
  <div>
    <h3>input</h3>
    <div>
      <h3>基础用法</h3>
      <el-input v-model="input" placeholder="请输入内容"></el-input>
    </div>
    <div>
      <h3>禁用状态</h3>
      <el-input
        placeholder="请输入内容"
        v-model="input"
        :disabled="true">
      </el-input>
    </div>
    <div>
      <h3>可清空</h3>
      <el-input
        placeholder="请输入内容"
        v-model="input"
        clearable>
      </el-input>
    </div>
    <div>
      <h3>文本域</h3>
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>
    </div>
    <div>
      <h3>自适应高度</h3>
      <el-input
        type="textarea"
        autosize
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>
      <div style="margin: 20px 0;"></div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>
    </div>
    <div>
      <h3>复合型输入框</h3>
      <el-input placeholder="请输入内容" v-model="input2">
        <template v-slot:prepend>Http://</template>
      </el-input>
    </div>
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="input2">
        <template v-slot:append>.com</template>
      </el-input>
    </div>
    <div style="margin-top: 15px">
      <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
        <template v-slot:append>
          <el-button icon="el-icon-search"></el-button>
        </template>
      </el-input>
    </div>
    <div>
      <h3>尺寸</h3>
      <el-input
        placeholder="请输入内容"
        suffix-icon="el-icon-date"
        v-model="input1">
      </el-input>
      <el-input
        size="medium"
        placeholder="请输入内容"
        suffix-icon="el-icon-date"
        v-model="input2">
      </el-input>
      <el-input
        size="small"
        placeholder="请输入内容"
        suffix-icon="el-icon-date"
        v-model="input3">
      </el-input>
      <el-input
        size="mini"
        placeholder="请输入内容"
        suffix-icon="el-icon-date"
        v-model="input4">
      </el-input>
    </div>
  </div>
</template>

<script>
  import {ref, watch} from 'vue'

  export default {
    name: "Input",
    setup() {
      const input = ref('')
      const textarea = ref('123')
      const input1 = ref('')
      const input2 = ref('')
      const input3 = ref('')
      const input4 = ref('')

      watch(textarea, (val) => {
        console.log('tx:',val)
      })
      return {
        input,
        input1,
        input2,
        input3,
        input4,
        textarea
      }
    }
  }
</script>

<style scoped>

</style>
