<template>
  <label
    class="el-radio"
    :class="[
      border && radioSize ? 'el-radio--' + radioSize : '',
      { 'is-disabled': isDisabled },
      { 'is-focus': focus },
      { 'is-bordered': border },
      { 'is-checked': model === label }
    ]"
    role="radio"
    :aria-checked="model === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <span
      class="el-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label
      }"
    >
      <span class="el-radio__inner" />
      <input
        ref="radio"
        v-model="model"
        class="el-radio__original"
        :value="label"
        type="radio"
        aria-hidden="true"
        :name="name"
        :disabled="isDisabled"
        tabindex="-1"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
      >
    </span>
    <span
      class="el-radio__label"
      @keydown.stop
    >
      <slot />
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>
<script>
  import {ref, watchEffect, computed, getCurrentInstance, nextTick, inject} from 'vue'
  import { useRadioGroup } from './radio-group'
  import Emitter from 'src/mixins/emitter'
  import {useELEMENT} from "src/index"

  export default {
    name: 'ElRadio',

    // mixins: [Emitter],

    /*inject: {
      elForm: {
        default: ''
      },

      elFormItem: {
        default: ''
      }
    },*/

    componentName: 'ElRadio',

    props: {
      modelValue: {},
      label: {},
      disabled: Boolean,
      name: String,
      border: Boolean,
      size: String
    },

    setup(props, ctx) {
      // this
      const instance = getCurrentInstance()
      const elForm = inject('elForm', '')
      const elFormItem = inject('elFormItem', '')
      const ELEMENT = useELEMENT()

      // private
      let _radioGroup = undefined
      // data
      const focus = ref(false)
      const parent = useRadioGroup()
      // console.log(parent)
      // computed
      const isGroup = computed(() => {
        // let parent = this.$parent;
        if (parent && parent.name === 'ElRadioGroup') {
          _radioGroup = parent
          return true
        }
        return false
      })
      const _elFormItemSize = computed(() => {
        return (elFormItem || {}).elFormItemSize
      })
      const radioSize = computed(() => {
        const temRadioSize = props.size || _elFormItemSize || (ELEMENT || {}).size
        return isGroup.value
          ? _radioGroup.radioGroupSize || temRadioSize
          : temRadioSize
      })
      const isDisabled = computed(() => {
        return isGroup.value
          ? _radioGroup.disabled || props.disabled || (elForm || {}).disabled
          : props.disabled || (elForm || {}).disabled
      })
      const tabIndex = computed(() => {
        return (isDisabled || (isGroup.value && model.value !== props.label)) ? -1 : 0
      })

      const model = computed({
        get() {
          return isGroup.value ? _radioGroup.modelValue.value : props.modelValue
        },
        set(val) {
          if (isGroup.value) {
            _radioGroup.emit(val)
            // this.dispatch('ElRadioGroup', 'input', [val])
          } else {
            ctx.emit('update:modelValue', val)
          }
          instance.refs.radio && (instance.refs.radio.checked = props.modelValue === props.label)
        }
      })

      // methods
      function handleChange() {
        nextTick(() => {
          ctx.emit('changeValue', model.value)
          // isGroup.value && this.dispatch('ElRadioGroup', 'handleChange', model.value)
        })
      }

      return {
        focus,
        isGroup,
        isDisabled,
        model,
        tabIndex,
        radioSize,
        handleChange
      }
    },

    /*data() {
      return {
        focus: false
      };
    },
    computed: {
      isGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'ElRadioGroup') {
            parent = parent.$parent;
          } else {
            this._radioGroup = parent;
            return true;
          }
        }
        return false;
      },
      model: {
        get () {
          return this.isGroup ? this._radioGroup.value : this.value
        },
        set (val) {
          if (this.isGroup) {
            this.dispatch('ElRadioGroup', 'input', [val])
          } else {
            this.$emit('input', val)
          }
          this.$refs.radio && (this.$refs.radio.checked = this.model === this.label)
        }
      },
      _elFormItemSize () {
        return (this.elFormItem || {}).elFormItemSize
      },
      radioSize () {
        const temRadioSize = this.size || this._elFormItemSize || (this.$ELEMENT || {}).size
        return this.isGroup
          ? this._radioGroup.radioGroupSize || temRadioSize
          : temRadioSize
      },
      isDisabled () {
        return this.isGroup
          ? this._radioGroup.disabled || this.disabled || (this.elForm || {}).disabled
          : this.disabled || (this.elForm || {}).disabled
      },
      tabIndex () {
        return (this.isDisabled || (this.isGroup && this.model !== this.label)) ? -1 : 0
      }
    },

    methods: {
      handleChange () {
        this.$nextTick(() => {
          this.$emit('change', this.model)
          this.isGroup && this.dispatch('ElRadioGroup', 'handleChange', this.model)
        })
      }
    }*/
  }
</script>
