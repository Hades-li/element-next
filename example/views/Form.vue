<template>
    <div class="form">
      <h3>form</h3>
      <el-form ref="root">
        <el-form-item></el-form-item>
      </el-form>
    </div>
</template>

<script>
import {ref,isRef, unref, onMounted} from 'vue'
export default {
  name: 'Form',
  setup() {
    const root = ref(null)
    onMounted(() => {
      const form = unref(root)
      console.log(form)
    })
    return {
      root
    }
  }
}
</script>

<style scoped>

</style>
