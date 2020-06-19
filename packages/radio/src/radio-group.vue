<template>
  <component
    :is="_elTag"
    class="el-radio-group"
    role="radiogroup"
    @handle-change="change"
    @keydown="handleKeydown"
  >
    <slot></slot>
  </component>
</template>
<script>
import {
  computed,
  provide, inject, watchEffect, readonly, getCurrentInstance, onMounted
} from 'vue'
import Emitter from 'src/mixins/emitter'
import { useELEMENT } from 'src/index'

const keyCode = Object.freeze({
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
})

const NAME = Symbol('ElRadioGroup')
const MODEL = Symbol('modelValue')

export function useName () {
  return inject(NAME)
}

export function useModelValue () {
  return inject(MODEL)
}

export default {
  name: 'ElRadioGroup',

  componentName: 'ElRadioGroup',

  /*inject: {
    elFormItem: {
      default: ''
    }
  },*/

  mixins: [Emitter],

  props: {
    modelValue: {},
    size: String,
    fill: String,
    textColor: String,
    disabled: Boolean
  },
  setup (props, ctx) {
    const instance = getCurrentInstance()
    const elFormItem = inject('elFormItem', '')
    const modelVal = readonly(props.modelValue)
    const ELEMENT = useELEMENT()
    const _elFormItemSize = computed(() => {
      return (elFormItem || {}).elFormItemSize
    })
    const _elTag = computed(() => {
      return (instance.vnode.data || {}).tag || 'div'
    })
    const radioGroupSize = () => {
      return props.size || _elFormItemSize || (ELEMENT || {}).size
    }

    watchEffect(() => {
      // this.dispatch('ElFormItem', 'el.form.change', [this.value]);
    })

    // methods
    const change = value => {
      ctx.emit('onUpdate:modelValue', value)
    }

    const handleKeydown = (e) => { // 左右上下按键 可以在radio组内切换不同选项
      debugger
      const target = e.target
      const className = target.nodeName === 'INPUT' ? '[type=radio]' : '[role=radio]'
      const radios = this.$el.querySelectorAll(className)
      const length = radios.length
      const index = [].indexOf.call(radios, target)
      const roleRadios = this.$el.querySelectorAll('[role=radio]')
      switch (e.keyCode) {
        case keyCode.LEFT:
        case keyCode.UP:
          e.stopPropagation()
          e.preventDefault()
          if (index === 0) {
            roleRadios[length - 1].click()
            roleRadios[length - 1].focus()
          } else {
            roleRadios[index - 1].click()
            roleRadios[index - 1].focus()
          }
          break
        case keyCode.RIGHT:
        case keyCode.DOWN:
          if (index === (length - 1)) {
            e.stopPropagation()
            e.preventDefault()
            roleRadios[0].click()
            roleRadios[0].focus()
          } else {
            roleRadios[index + 1].click()
            roleRadios[index + 1].focus()
          }
          break
        default:
          break
      }
    }

    provide(NAME, 'ElRadioGroup')
    provide(MODEL, props.modelValue)

    onMounted(() => {
      console.log(instance)

      const radios = instance.vnode.el.querySelectorAll('[type=radio]')
      const firstLabel = instance.vnode.el.querySelectorAll('[role=radio]')[0]
      if (![].some.call(radios, radio => radio.checked) && firstLabel) {
        firstLabel.tabIndex = 0
      }
    })
    return {
      change,
      handleKeydown,
      _elTag
    }
  },
  /*computed: {
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    _elTag() {
      return (this.$vnode.data || {}).tag || 'div';
    },
    radioGroupSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    }
  },*/

  /*created() {
    this.$on('handleChange', value => {
      this.$emit('change', value);
    });
  },*/
  /*mounted() {
    // 当radioGroup没有默认选项时，第一个可以选中Tab导航
    const radios = this.$el.querySelectorAll('[type=radio]');
    const firstLabel = this.$el.querySelectorAll('[role=radio]')[0];
    if (![].some.call(radios, radio => radio.checked) && firstLabel) {
      firstLabel.tabIndex = 0;
    }
  },*/
  methods: {
    handleKeydown (e) { // 左右上下按键 可以在radio组内切换不同选项
      const target = e.target
      const className = target.nodeName === 'INPUT' ? '[type=radio]' : '[role=radio]'
      const radios = this.$el.querySelectorAll(className)
      const length = radios.length
      const index = [].indexOf.call(radios, target)
      const roleRadios = this.$el.querySelectorAll('[role=radio]')
      switch (e.keyCode) {
        case keyCode.LEFT:
        case keyCode.UP:
          e.stopPropagation()
          e.preventDefault()
          if (index === 0) {
            roleRadios[length - 1].click()
            roleRadios[length - 1].focus()
          } else {
            roleRadios[index - 1].click()
            roleRadios[index - 1].focus()
          }
          break
        case keyCode.RIGHT:
        case keyCode.DOWN:
          if (index === (length - 1)) {
            e.stopPropagation()
            e.preventDefault()
            roleRadios[0].click()
            roleRadios[0].focus()
          } else {
            roleRadios[index + 1].click()
            roleRadios[index + 1].focus()
          }
          break
        default:
          break
      }
    }
  },
  /*watch: {
    value(value) {
      this.dispatch('ElFormItem', 'el.form.change', [this.value]);
    }
  }*/
}
</script>

