<template>
  <form
    class="el-form"
    :class="[
      labelPosition ? 'el-form--label-' + labelPosition : '',
      { 'el-form--inline': inline }
    ]"
  >
    <slot />
  </form>
</template>
<script>
  import {provide, inject,computed, getCurrentInstance, ref, reactive, watch } from 'vue'
  import objectAssign from 'src/utils/merge'

  const ELFORMSYMBOL = Symbol('ElForm')

  export function useElForm() {
    return inject(ELFORMSYMBOL)
  }

  export default {
    name: 'ElForm',

    componentName: 'ElForm',

    /*provide() {
      return {
        elForm: this
      }
    },*/

    props: {
      model: Object,
      rules: Object,
      labelPosition: String,
      labelWidth: String,
      labelSuffix: {
        type: String,
        default: ''
      },
      inline: Boolean,
      inlineMessage: Boolean,
      statusIcon: Boolean,
      showMessage: {
        type: Boolean,
        default: true
      },
      size: String,
      disabled: Boolean,
      validateOnRuleChange: {
        type: Boolean,
        default: true
      },
      hideRequiredAsterisk: {
        type: Boolean,
        default: false
      }
    },
    setup(props, ctx) {
      const instance = getCurrentInstance()
      const fields = ref([])
      const potentialLabelWidthArr = ref([])
      // computed
      const autoLabelWidth = computed(() => {
        if (!potentialLabelWidthArr.length) return 0
        const max = Math.max(...potentialLabelWidthArr)
        return max ? `${max}px` : ''
      })

      //methods
      const validate = (callback) => {
        if (!props.model) {
          console.warn('[Element Warn][Form]model is required for validate to work!')
          return
        }

        let promise
        // if no callback, return promise
        if (typeof callback !== 'function' && window.Promise) {
          promise = new window.Promise((resolve, reject) => {
            callback = function (valid) {
              valid ? resolve(valid) : reject(valid)
            }
          })
        }

        let valid = true
        let count = 0
        // 如果需要验证的fields为空，调用验证时立刻返回callback
        if (fields.length === 0 && callback) {
          callback(true)
        }
        let invalidFields = {}
        fields.forEach(field => {
          field.validate('', (message, field) => {
            if (message) {
              valid = false
            }
            invalidFields = objectAssign({}, invalidFields, field)
            if (typeof callback === 'function' && ++count === fields.length) {
              callback(valid, invalidFields)
            }
          })
        })

        if (promise) {
          return promise
        }
      }
      const resetFields = () => {
        if (!props.model) {
          console.warn('[Element Warn][Form]model is required for resetFields to work.')
          return
        }
        fields.forEach(field => {
          field.resetField()
        })
      }
      const clearValidate = (props = []) => {
        const fields = props.length
          ? (typeof props === 'string'
              ? fields.filter(field => props === field.prop)
              : fields.filter(field => props.indexOf(field.prop) > -1)
          ) : fields
        fields.forEach(field => {
          field.clearValidate()
        })
      }
      const validateField = (props, cb) => {
        props = [].concat(props)
        const _fields = fields.filter(field => props.indexOf(field.prop) !== -1)
        if (!_fields.length) {
          console.warn('[Element Warn]please pass correct props!')
          return
        }

        _fields.forEach(field => {
          field.validate('', cb)
        })
      }

      const getLabelWidthIndex = (width) => {
        const index = potentialLabelWidthArr.indexOf(width)
        // it's impossible
        if (index === -1) {
          throw new Error('[ElementForm]unpected width ', width)
        }
        return index
      }

      const registerLabelWidth = (val, oldVal) => {
        if (val && oldVal) {
          const index = getLabelWidthIndex(oldVal)
          potentialLabelWidthArr.splice(index, 1, val)
        } else if (val) {
          potentialLabelWidthArr.push(val)
        }
      }
      const deregisterLabelWidth = (val) => {
        const index = getLabelWidthIndex(val)
        potentialLabelWidthArr.splice(index, 1)
      }

      // watch
      watch(props.rules, () => {
        // remove then add event listeners on form-item after form rules change
        fields.forEach(field => {
          field.removeValidateEvents()
          field.addValidateEvents()
        })

        if (props.validateOnRuleChange) {
          validate(() => {
          })
        }
      })

      // provide
      const addField = (field) => {
        fields.value.push(field)
      }
      const removeField = (field) => {
        fields.splice(fields.indexOf(field), 1)
      }
      // debugger

      // clear
      provide(ELFORMSYMBOL, {
        instance,
        name: instance.type.name,
        ...props,
        autoLabelWidth: autoLabelWidth.value,
        addField,
        removeField,
        validate,
        registerLabelWidth,
        deregisterLabelWidth
      })

      return {
        autoLabelWidth,
        resetFields,
        clearValidate,
        validate,
        validateField
      }
    },
    computed: {
      /*autoLabelWidth() {
        if (!this.potentialLabelWidthArr.length) return 0
        const max = Math.max(...this.potentialLabelWidthArr)
        return max ? `${max}px` : ''
      }*/
    },
    watch: {
      /*rules() {
        // remove then add event listeners on form-item after form rules change
        this.fields.forEach(field => {
          field.removeValidateEvents()
          field.addValidateEvents()
        })

        if (this.validateOnRuleChange) {
          this.validate(() => {
          })
        }
      }*/
    },
    /*data() {
      return {
        fields: [],
        potentialLabelWidthArr: [] // use this array to calculate auto width
      }
    },*/
    created() {
      /*this.$on('el.form.addField', (field) => {
        if (field) {
          this.fields.push(field)
        }
      })*/
      /* istanbul ignore next */
      /*this.$on('el.form.removeField', (field) => {
        if (field.prop) {
          this.fields.splice(this.fields.indexOf(field), 1)
        }
      })*/
    },
    /*methods: {
      resetFields() {
        if (!this.model) {
          console.warn('[Element Warn][Form]model is required for resetFields to work.')
          return
        }
        this.fields.forEach(field => {
          field.resetField()
        })
      },
      clearValidate(props = []) {
        const fields = props.length
          ? (typeof props === 'string'
              ? this.fields.filter(field => props === field.prop)
              : this.fields.filter(field => props.indexOf(field.prop) > -1)
          ) : this.fields
        fields.forEach(field => {
          field.clearValidate()
        })
      },
      validate(callback) {
        if (!this.model) {
          console.warn('[Element Warn][Form]model is required for validate to work!')
          return
        }

        let promise
        // if no callback, return promise
        if (typeof callback !== 'function' && window.Promise) {
          promise = new window.Promise((resolve, reject) => {
            callback = function (valid) {
              valid ? resolve(valid) : reject(valid)
            }
          })
        }

        let valid = true
        let count = 0
        // 如果需要验证的fields为空，调用验证时立刻返回callback
        if (this.fields.length === 0 && callback) {
          callback(true)
        }
        let invalidFields = {}
        this.fields.forEach(field => {
          field.validate('', (message, field) => {
            if (message) {
              valid = false
            }
            invalidFields = objectAssign({}, invalidFields, field)
            if (typeof callback === 'function' && ++count === this.fields.length) {
              callback(valid, invalidFields)
            }
          })
        })

        if (promise) {
          return promise
        }
      },
      validateField(props, cb) {
        props = [].concat(props)
        const fields = this.fields.filter(field => props.indexOf(field.prop) !== -1)
        if (!fields.length) {
          console.warn('[Element Warn]please pass correct props!')
          return
        }

        fields.forEach(field => {
          field.validate('', cb)
        })
      },
      getLabelWidthIndex(width) {
        const index = this.potentialLabelWidthArr.indexOf(width)
        // it's impossible
        if (index === -1) {
          throw new Error('[ElementForm]unpected width ', width)
        }
        return index
      },
      registerLabelWidth(val, oldVal) {
        if (val && oldVal) {
          const index = this.getLabelWidthIndex(oldVal)
          this.potentialLabelWidthArr.splice(index, 1, val)
        } else if (val) {
          this.potentialLabelWidthArr.push(val)
        }
      },
      deregisterLabelWidth(val) {
        const index = this.getLabelWidthIndex(val)
        this.potentialLabelWidthArr.splice(index, 1)
      }
    }*/
  }
</script>
