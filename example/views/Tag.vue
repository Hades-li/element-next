<template>
  <div class="tag">
    <h3>Tag</h3>
    <h3>基础用法</h3>
    <div>
      <el-tag>标签一</el-tag>
      <el-tag type="success">标签二</el-tag>
      <el-tag type="info">标签三</el-tag>
      <el-tag type="warning">标签四</el-tag>
      <el-tag type="danger">标签五</el-tag>
    </div>
    <h3>可删除</h3>
    <div>
      <el-tag
        v-for="tag in tags"
        :key="tag.name"
        closable
        :type="tag.type">
        {{tag.name}}
      </el-tag>
    </div>
    <h3>动态编辑标签</h3>
    <div>
      <el-tag
        :key="tag"
        v-for="tag in dynamicTags"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)">
        {{tag}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
    </div>
  </div>
  <h3>不同主题</h3>
  <div class="tag-group">
    <span class="tag-group__title">Dark</span>
    <el-tag
      v-for="item in items"
      :key="item.label"
      :type="item.type"
      effect="dark">
      {{ item.label }}
    </el-tag>
  </div>
  <div class="tag-group">
    <span class="tag-group__title">Plain</span>
    <el-tag
      v-for="item in items"
      :key="item.label"
      :type="item.type"
      effect="plain">
      {{ item.label }}
    </el-tag>
  </div>
</template>

<script>
  import {ref, nextTick} from 'vue'

  export default {
    name: "Tag",
    setup() {
      const tags = ref([
        {name: '标签一', type: ''},
        {name: '标签二', type: 'success'},
        {name: '标签三', type: 'info'},
        {name: '标签四', type: 'warning'},
        {name: '标签五', type: 'danger'}
      ])
      const items = ref([
        { type: '', label: '标签一' },
        { type: 'success', label: '标签二' },
        { type: 'info', label: '标签三' },
        { type: 'danger', label: '标签四' },
        { type: 'warning', label: '标签五' }
      ])
      const dynamicTags = ref(['标签一', '标签二', '标签三'])
      const inputVisible = ref(false)
      const inputValue = ref('')
      const saveTagInput = ref(null)

      function handleClose(tag) {
        dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
      }

      function showInput() {
        inputVisible.value = true;
        nextTick(_ => {
          saveTagInput.value.input.focus();
        })
      }

      function handleInputConfirm() {
        if (inputValue.value) {
          dynamicTags.value.push(inputValue.value)
        }
        inputVisible.value = false;
        inputValue.value = '';
      }

      return {
        tags,
        inputValue,
        inputVisible,
        saveTagInput,
        dynamicTags,
        items,
        handleClose,
        handleInputConfirm,
        showInput
      }
    }
  }
</script>

<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
