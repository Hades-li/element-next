<template>
    <div class="form">
      <h3>form</h3>
      <el-form ref="refForm" :model="form" label-width="80px">
        <el-form-item label="特殊资源">
          <el-radio-group v-model="form.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

    </div>
</template>

<script>
import {ref,isRef, unref, onMounted, reactive} from 'vue'
export default {
  name: 'Form',
  setup() {
    const refForm = ref(null)
    const form = reactive({
      resource: null,
    })
    onMounted(() => {

    })
    return {
      refForm,
      form
    }
  }
}
</script>

<style scoped>

</style>
