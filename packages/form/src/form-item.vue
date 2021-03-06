<template>
  <div
    class="el-form-item"
    :class="[{
               'el-form-item--feedback': elForm && elForm.statusIcon,
               'is-error': validateState === 'error',
               'is-validating': validateState === 'validating',
               'is-success': validateState === 'success',
               'is-required': isRequired || required,
               'is-no-asterisk': elForm && elForm.hideRequiredAsterisk
             },
             sizeClass ? 'el-form-item--' + sizeClass : ''
    ]"
  >
    <label-wrap
      :is-auto-width="labelStyle && labelStyle.width === 'auto'"
      :update-all="elForm.labelWidth === 'auto'"
    >
      <label
        v-if="label || slots.label"
        :for="labelFor"
        class="el-form-item__label"
        :style="labelStyle"
      >
        <slot name="label">{{ label + elForm.labelSuffix }}</slot>
      </label>
    </label-wrap>
    <div
      class="el-form-item__content"
      :style="contentStyle"
    >
      <slot />
      <transition name="el-zoom-in-top">
        <slot
          v-if="validateState === 'error' && showMessage && elForm.showMessage"
          name="error"
          :error="validateMessage"
        >
          <div
            class="el-form-item__error"
            :class="{
              'el-form-item__error--inline': typeof inlineMessage === 'boolean'
                ? inlineMessage
                : (elForm && elForm.inlineMessage || false)
            }"
          >
            {{ validateMessage }}
          </div>
        </slot>
      </transition>
    </div>
  </div>
</template>
<script>
  import {provide, inject, getCurrentInstance, computed, reactive, watch, watchEffect, nextTick, onMounted, onBeforeUnmount} from 'vue'
  import AsyncValidator from 'async-validator'
  import emitter from 'src/mixins/emitter'
  import objectAssign from 'src/utils/merge'
  import {noop, getPropByPath} from 'src/utils/util'
  import LabelWrap from './label-wrap'
  import {useElForm} from "./form";
  import {useELEMENT} from "src/index";

  const ELFORMITEMSYMBOL = Symbol('elFormItem')

  export function useElFormItem() {
    return inject(ELFORMITEMSYMBOL, undefined)
  }

  export default {
    name: 'ElFormItem',

    componentName: 'ElFormItem',
    components: {
      // use this component to calculate auto width
      LabelWrap
    },

    // mixins: [emitter],

    /*provide() {
      return {
        elFormItem: this
      };
    },*/

    // inject: ['elForm'],

    props: {
      label: String,
      labelWidth: String,
      prop: String,
      required: {
        type: Boolean,
        default: undefined
      },
      rules: [Object, Array],
      error: String,
      validateStatus: String,
      for: String,
      inlineMessage: {
        type: [String, Boolean],
        default: ''
      },
      showMessage: {
        type: Boolean,
        default: true
      },
      size: String
    },
    setup(props, ctx) {
      const instance = getCurrentInstance()
      const elForm = useElForm()
      const parentElFormItem = useElFormItem() // 通过provide方式来获取嵌套的父级form-item
      const ELEMENT = useELEMENT()
      let initialValue = undefined
      const slots = ctx.slots.default()

      // data
      const data = reactive({
        validateState: '',
        validateMessage: '',
        validateDisabled: false,
        validator: {},
        isNested: false,
        computedLabelWidth: ''
      })
      if (parentElFormItem) {
        data.isNested = true
      }

      // computed
      const _formSize = computed(() => {
        return elForm.size
      })
      const elFormItemSize = computed(() => {
        return props.size || _formSize.value
      })
      const sizeClass = computed(() => {
        return elFormItemSize.value || (ELEMENT || {}).size
      })
      const labelFor = computed(() => {
        return props.for || props.prop
      })
      const labelStyle = computed(() => {
        const ret = {}
        if (elForm.labelPosition === 'top') return ret
        const labelWidth = props.labelWidth || elForm.labelWidth
        if (labelWidth) {
          ret.width = labelWidth
        }
        return ret
      })

      const contentStyle = computed(() => {
        const ret = {}
        const label = props.label
        if (elForm.labelPosition === 'top' || elForm.inline) return ret
        if (!label && !props.labelWidth && data.isNested) return ret
        const labelWidth = props.labelWidth || elForm.labelWidth
        if (labelWidth === 'auto') {
          if (props.labelWidth === 'auto') {
            ret.marginLeft = data.computedLabelWidth
          } else if (elForm.labelWidth === 'auto') {
            ret.marginLeft = elForm.autoLabelWidth
          }
        } else {
          ret.marginLeft = labelWidth
        }
        return ret
      })
      const fieldValue = computed(() => {
        const model = elForm.model
        if (!model || !props.prop) {
          return
        }

        let path = props.prop
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.')
        }

        return getPropByPath(model, path, true).v
      })
      // console.log(getRules)
      const isRequired = computed(() => {
        let rules = getRules()
        let isRequired = false

        if (rules && rules.length) {
          rules.every(rule => {
            if (rule.required) {
              isRequired = true
              return false
            }
            return true
          })
        }
        return isRequired
      })

      // watch
      watchEffect(() => {
        data.validateState = props.validateStatus
      })
      watchEffect(() => {
        data.validateMessage = props.error
        data.validateState = props.error
      })

      // methods

      function getRules() {
        let formRules = elForm.rules
        const selfRules = props.rules
        const requiredRule = props.required !== undefined ? {required: !!props.required} : []

        const prop = getPropByPath(formRules, props.prop || '')
        formRules = formRules ? (prop.o[props.prop || ''] || prop.v) : []

        return [].concat(selfRules || formRules || []).concat(requiredRule)
      }
      function getFilteredRule(trigger) {
        const rules = getRules()

        return rules.filter(rule => {
          if (!rule.trigger || trigger === '') return true
          if (Array.isArray(rule.trigger)) {
            return rule.trigger.indexOf(trigger) > -1
          } else {
            return rule.trigger === trigger
          }
        }).map(rule => objectAssign({}, rule))
      }
      function validate (trigger, callback = noop) {
        data.validateDisabled = false
        const rules = getFilteredRule(trigger)
        if ((!rules || rules.length === 0) && props.required === undefined) {
          callback()
          return true
        }

        data.validateState = 'validating'

        const descriptor = {}
        if (rules && rules.length > 0) {
          rules.forEach(rule => {
            delete rule.trigger
          })
        }
        descriptor[props.prop] = rules

        const validator = new AsyncValidator(descriptor)
        const model = {}

        model[props.prop] = fieldValue.value

        validator.validate(model, {firstFields: true}, (errors, invalidFields) => {
          data.validateState = !errors ? 'success' : 'error'
          data.validateMessage = errors ? errors[0].message : ''

          callback(data.validateMessage, invalidFields)
          // elForm && elForm.$emit('validate', this.prop, !errors, this.validateMessage || null)
          elForm && elForm.validate()
        })
      }
      function clearValidate () {
        data.validateState = ''
        data.validateMessage = ''
        data.validateDisabled = false
      }
      function resetField () {
        data.validateState = ''
        data.validateMessage = ''

        let model = elForm.model
        let value = fieldValue.value
        let path = props.prop
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.')
        }

        let prop = getPropByPath(model, path, true)

        data.validateDisabled = true
        if (Array.isArray(value)) {
          prop.o[prop.k] = [].concat(initialValue)
        } else {
          prop.o[prop.k] = initialValue
        }

        // reset validateDisabled after onFieldChange triggered
        nextTick(() => {
          data.validateDisabled = false
        })

        this.broadcast('ElTimeSelect', 'fieldReset', this.initialValue)
      }
      // 废弃，初始化事件
      function addValidateEvents() {
        const rules = getRules()

        if (rules.length || props.required !== undefined) {
          // this.$on('el.form.blur', this.onFieldBlur)
          // this.$on('el.form.change', this.onFieldChange)
        }
      }
      function onFieldBlur() {
        validate('blur')
      }
      function onFieldChange() {
        if (data.validateDisabled) {
          data.validateDisabled = false
          return
        }

        validate('change')
      }

      function updateComputedLabelWidth(width) {
        data.computedLabelWidth = width ? `${width}px` : ''
      }

      // mounted
      onMounted(() => {
        if (props.prop) {
          // this.dispatch('ElForm', 'el.form.addField', [this])
          elForm.addField(instance)

          let initialValue = fieldValue.value
          if (Array.isArray(initialValue)) {
            initialValue = [].concat(initialValue)
          }
          Object.defineProperty(this, 'initialValue', {
            value: initialValue
          })

          // addValidateEvents()
        }
      })
      onBeforeUnmount(() => {
        elForm.removeField(instance)
      })

      // provide
      provide(ELFORMITEMSYMBOL, {
        instance,
        name: instance.type.name,
        elFormItemSize: elFormItemSize.value,
        validateState: data.validateState,
        onFieldBlur,
        onFieldChange,
      })

      return {
        sizeClass,
        labelFor,
        labelStyle,
        contentStyle,
        fieldValue,
        isRequired,
        elForm,
        slots,
        validate,
        validateState: data.validateState
      }
    },
    computed: {
      /*labelFor() {
        return this.for || this.prop
      },*/
      /*labelStyle() {
        const ret = {}
        if (this.form.labelPosition === 'top') return ret
        const labelWidth = this.labelWidth || this.form.labelWidth
        if (labelWidth) {
          ret.width = labelWidth
        }
        return ret
      },*/
      /*contentStyle() {
        const ret = {}
        const label = this.label
        if (this.form.labelPosition === 'top' || this.form.inline) return ret
        if (!label && !this.labelWidth && this.isNested) return ret
        const labelWidth = this.labelWidth || this.form.labelWidth
        if (labelWidth === 'auto') {
          if (this.labelWidth === 'auto') {
            ret.marginLeft = this.computedLabelWidth
          } else if (this.form.labelWidth === 'auto') {
            ret.marginLeft = this.elForm.autoLabelWidth
          }
        } else {
          ret.marginLeft = labelWidth
        }
        return ret
      },*/
      /*form() {
        let parent = this.$parent
        let parentName = parent.$options.componentName
        while (parentName !== 'ElForm') {
          if (parentName === 'ElFormItem') {
            this.isNested = true
          }
          parent = parent.$parent
          parentName = parent.$options.componentName
        }
        return parent
      },*/
      /*fieldValue() {
        const model = this.form.model
        if (!model || !this.prop) {
          return
        }

        let path = this.prop
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.')
        }

        return getPropByPath(model, path, true).v
      },*/
      /*isRequired() {
        let rules = this.getRules()
        let isRequired = false

        if (rules && rules.length) {
          rules.every(rule => {
            if (rule.required) {
              isRequired = true
              return false
            }
            return true
          })
        }
        return isRequired
      },*/
      /*_formSize() {
        return this.elForm.size
      },*/
      /*elFormItemSize() {
        return this.size || this._formSize
      },*/
      /*sizeClass() {
        return this.elFormItemSize || (this.$ELEMENT || {}).size
      }*/
    },
    watch: {
      /*error: {
        immediate: true,
        handler(value) {
          this.validateMessage = value
          this.validateState = value ? 'error' : ''
        }
      },*/
      /*validateStatus(value) {
        this.validateState = value
      }*/
    },
    mounted() {
      /*if (this.prop) {
        this.dispatch('ElForm', 'el.form.addField', [this])

        let initialValue = this.fieldValue
        if (Array.isArray(initialValue)) {
          initialValue = [].concat(initialValue)
        }
        Object.defineProperty(this, 'initialValue', {
          value: initialValue
        })

        this.addValidateEvents()
      }*/
    },
    /*beforeDestroy() {
      this.dispatch('ElForm', 'el.form.removeField', [this])
    },*/
    /*data() {
      return {
        validateState: '',
        validateMessage: '',
        validateDisabled: false,
        validator: {},
        isNested: false,
        computedLabelWidth: ''
      }
    },*/
    methods: {
      /*validate(trigger, callback = noop) {
        this.validateDisabled = false
        const rules = this.getFilteredRule(trigger)
        if ((!rules || rules.length === 0) && this.required === undefined) {
          callback()
          return true
        }

        this.validateState = 'validating'

        const descriptor = {}
        if (rules && rules.length > 0) {
          rules.forEach(rule => {
            delete rule.trigger
          })
        }
        descriptor[this.prop] = rules

        const validator = new AsyncValidator(descriptor)
        const model = {}

        model[this.prop] = this.fieldValue

        validator.validate(model, {firstFields: true}, (errors, invalidFields) => {
          this.validateState = !errors ? 'success' : 'error'
          this.validateMessage = errors ? errors[0].message : ''

          callback(this.validateMessage, invalidFields)
          this.elForm && this.elForm.$emit('validate', this.prop, !errors, this.validateMessage || null)
        })
      },*/
      /*clearValidate() {
        this.validateState = ''
        this.validateMessage = ''
        this.validateDisabled = false
      },*/
      /*resetField() {
        this.validateState = ''
        this.validateMessage = ''

        let model = this.form.model
        let value = this.fieldValue
        let path = this.prop
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.')
        }

        let prop = getPropByPath(model, path, true)

        this.validateDisabled = true
        if (Array.isArray(value)) {
          prop.o[prop.k] = [].concat(this.initialValue)
        } else {
          prop.o[prop.k] = this.initialValue
        }

        // reset validateDisabled after onFieldChange triggered
        this.$nextTick(() => {
          this.validateDisabled = false
        })

        this.broadcast('ElTimeSelect', 'fieldReset', this.initialValue)
      },*/
      /*getRules() {
        let formRules = this.form.rules
        const selfRules = this.rules
        const requiredRule = this.required !== undefined ? {required: !!this.required} : []

        const prop = getPropByPath(formRules, this.prop || '')
        formRules = formRules ? (prop.o[this.prop || ''] || prop.v) : []

        return [].concat(selfRules || formRules || []).concat(requiredRule)
      },*/
      /*getFilteredRule(trigger) {
        const rules = this.getRules()

        return rules.filter(rule => {
          if (!rule.trigger || trigger === '') return true
          if (Array.isArray(rule.trigger)) {
            return rule.trigger.indexOf(trigger) > -1
          } else {
            return rule.trigger === trigger
          }
        }).map(rule => objectAssign({}, rule))
      },*/
      /*onFieldBlur() {
        this.validate('blur')
      },
      onFieldChange() {
        if (this.validateDisabled) {
          this.validateDisabled = false
          return
        }

        this.validate('change')
      },*/
      /*updateComputedLabelWidth(width) {
        this.computedLabelWidth = width ? `${width}px` : ''
      },*/
      /*addValidateEvents() {
        const rules = this.getRules()

        if (rules.length || this.required !== undefined) {
          this.$on('el.form.blur', this.onFieldBlur)
          this.$on('el.form.change', this.onFieldChange)
        }
      },*/
      /*removeValidateEvents() {
        this.$off()
      }*/
    }
  }
</script>
