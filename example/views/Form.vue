<template>
    <div class="form">
      <h3 ref="title">form</h3>
      <el-form ref="root">

      </el-form>
    </div>
</template>

<script>
import {ref, onMounted} from 'vue'
export default {
  name: 'Form',
  setup() {
    const title = ref(null)
    const root = ref(null)
    onMounted(() => {
      console.log(root.value)
      console.log(title.value)
    })
  }
}
</script>

<style scoped>

</style>
