<template>
  <component
    :is="_elTag"
    class="el-radio-group"
    role="radiogroup"
    @keydown="handleKeydown"
  >
    <slot></slot>
  </component>
</template>
<script>
  import {
    nextTick,
    computed,
    provide, inject, watchEffect, getCurrentInstance, onMounted
  } from 'vue'
  import Emitter from 'src/mixins/emitter'
  import {useELEMENT} from 'src/index'

  const keyCode = Object.freeze({
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  })

  const RADIOGROUP = Symbol('radioGroup')

  export function useRadioGroup() {
    return inject(RADIOGROUP)
  }

  export default {
    name: 'ElRadioGroup',

    componentName: 'ElRadioGroup',

    /*inject: {
      elFormItem: {
        default: ''
      }
    },*/

    // mixins: [Emitter],

    props: {
      modelValue: {},
      size: String,
      fill: String,
      textColor: String,
      disabled: Boolean
    },
    setup(props, ctx) {
      const instance = getCurrentInstance()
      const elFormItem = inject('elFormItem', '')
      const ELEMENT = useELEMENT()
      const _elFormItemSize = computed(() => {
        return (elFormItem || {}).elFormItemSize
      })
      const _elTag = computed(() => {
        return (instance.vnode.data || {}).tag || 'div'
      })
      const radioGroupSize = computed(() => {
        return props.size || _elFormItemSize || (ELEMENT || {}).size
      })

      const modelValue = computed({
        get() {
          return props.modelValue
        },
        set(val) {
          changeEvent(val)
        }
      })
      watchEffect(() => {
        // this.dispatch('ElFormItem', 'el.form.change', [this.value]);
      })

      // methods
      const changeEvent = value => {
        ctx.emit('update:modelValue', value)
        nextTick(() => {
          ctx.emit('changeValue', value)
        })
      }

      const handleKeydown = (e) => { // 左右上下按键 可以在radio组内切换不同选项
        const target = e.target
        const className = target.nodeName === 'INPUT' ? '[type=radio]' : '[role=radio]'
        const radios = instance.vnode.el.querySelectorAll(className)
        const length = radios.length
        const index = [].indexOf.call(radios, target)
        const roleRadios = instance.vnode.el.querySelectorAll('[role=radio]')
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

      provide(RADIOGROUP, {
        name: 'ElRadioGroup',
        modelValue,
        fill: props.fill,
        textColor: props.textColor,
        radioGroupSize: props.size,
        disabled: props.disabled,
        emit: changeEvent
      })

      onMounted(() => {
        const radios = instance.vnode.el.querySelectorAll('[type=radio]')
        const firstLabel = instance.vnode.el.querySelectorAll('[role=radio]')[0]
        if (![].some.call(radios, radio => radio.checked) && firstLabel) {
          firstLabel.tabIndex = 0
        }
      })
      return {
        // changeEvent,
        handleKeydown,
        radioGroupSize,
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
    /*methods: {
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
    },*/
    /*watch: {
      value(value) {
        this.dispatch('ElFormItem', 'el.form.change', [this.value]);
      }
    }*/
  }
</script>

