<template>
    <div class="form">
      <h3>form</h3>
      <el-form ref="refForm" :model="form" label-width="80px">
        <el-form-item label="活动名称">
          <el-input :disabled="disable" clearable v-model="form.name" maxlength="20"></el-input>
        </el-form-item>
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
import {ref,isRef, unref, onMounted, reactive, watchEffect} from 'vue'
import ElButton from "packages/button/src/button";
export default {
  name: 'Form',
  components: {},
  setup() {
    const refForm = ref(null)
    const form = reactive({
      resource: null,
      name: ''
    })
    const disable = ref(false)
    onMounted(() => {

    })
    watchEffect(() => {
      console.log('radio:', form.resource)
    })
    return {
      refForm,
      form,
      disable
    }
  }
}
</script>

<style scoped>

</style>
