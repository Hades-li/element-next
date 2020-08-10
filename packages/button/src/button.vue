<template>
  <button
    class="el-button"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'el-button--' + type : '',
      buttonSize ? 'el-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle
      }
    ]"
    @click="handleClick"
  >
    <i
      v-if="loading"
      class="el-icon-loading"
    />
    <i
      v-if="icon && !loading"
      :class="icon"
    />
    <span v-if="$slots.default"><slot /></span>
  </button>
</template>
<script>
import {computed} from 'vue'
import {useELEMENT} from 'src/index'
import {useElForm} from "packages/form/src/form"
import {useElFormItem} from "packages/form/src/form-item"

export default {
  name: 'ElButton',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: String,
    icon: {
      type: String,
      default: ''
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean
  },
  setup(props, ctx) {
    // inject
    const elForm = useElForm()
    const elFormItem = useElFormItem()
    const ELEMENT = useELEMENT()

    // computed
    const _elFormItemSize = computed(() => {
      return (elFormItem || {}).elFormItemSize
    })
    const buttonSize = computed(() => {
      return props.size || _elFormItemSize.value || (ELEMENT || {}).size
    })
    const buttonDisabled = computed(() => {
      return props.disabled || (elForm || {}).disabled
    })

    function handleClick(evt) {
      ctx.emit('click', evt)
    }

    return {
      buttonSize,
      buttonDisabled,
      handleClick
    }
  },
  /*inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },*/

  /*computed: {
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    buttonSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    buttonDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    }
  },*/

  /*  methods: {
    handleClick(evt) {
      this.$emit('click', evt);
    }
  }*/
}
</script>
