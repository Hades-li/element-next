<template>
  <label
    class="el-radio-button"
    :class="[
      size ? 'el-radio-button--' + size : '',
      { 'is-active': value === label },
      { 'is-disabled': isDisabled },
      { 'is-focus': focus }
    ]"
    role="radio"
    :aria-checked="value === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="value = isDisabled ? value : label"
  >
    <input
      v-model="value"
      class="el-radio-button__orig-radio"
      :value="label"
      type="radio"
      :name="name"
      :disabled="isDisabled"
      tabindex="-1"
      @change="handleChange"
      @focus="focus = true"
      @blur="focus = false"
    >
    <span
      class="el-radio-button__inner"
      :style="value === label ? activeStyle : null"
      @keydown.stop
    >
      <slot />
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>
<script>
  import {useELEMENT} from "src"
  import {computed, nextTick, ref} from "vue"
  import {useElForm} from "packages/form/src/form"
  import {useElFormItem} from "packages/form/src/form-item"
  import { useRadioGroup } from "./radio-group"

  export default {
    name: 'ElRadioButton',

    // mixins: [Emitter],

    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },

    props: {
      label: {},
      disabled: Boolean,
      name: String
    },
    setup(props, ctx) {
// computed
      const ELEMENT = useELEMENT()
      const elForm = useElForm()
      const elFormItem = useElForm()
      const _radioGroup = useRadioGroup()
      // data
      const focus = ref(false)
      // computed
      const isGroup = computed(() => {
        if (_radioGroup && _radioGroup.name === 'ElRadioGroup') {
          return true
        }
        return false
      })
      const _elFormItemSize = computed(() => {
        return (elFormItem || {}).elFormItemSize
      })
      const size = computed(() => {
        return _radioGroup.radioGroupSize || _elFormItemSize || (ELEMENT || {}).size;
      })
      const isDisabled = computed(() => {
        return props.disabled || _radioGroup.disabled || (elForm || {}).disabled;
      })
      const tabIndex = computed(() => {
        return (isDisabled.value || (_radioGroup && value.value !== props.label)) ? -1 : 0;
      })
      const value = computed({
        get() {
          return _radioGroup.modelValue.value;
        },
        set(value) {
          _radioGroup.emit(value);
        }
      })
      const activeStyle = computed(() => {
        return {
          backgroundColor: _radioGroup.fill || '',
          borderColor: _radioGroup.fill || '',
          boxShadow: _radioGroup.fill ? `-1px 0 0 0 ${_radioGroup.fill}` : '',
          color: _radioGroup.textColor || ''
        }
      })

      // methods
      const handleChange = () => {
        nextTick(() => {
          // this.dispatch('ElRadioGroup', 'handleChange', this.value);
        });
      }

      return {
        isGroup,
        size,
        isDisabled,
        tabIndex,
        value,
        focus,
        activeStyle,
        handleChange
      }
    },
    /*data() {
      return {
        focus: false
      };
    },
    computed: {
      value: {
        get() {
          return this._radioGroup.value;
        },
        set(value) {
          this._radioGroup.$emit('input', value);
        }
      },
      _radioGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'ElRadioGroup') {
            parent = parent.$parent;
          } else {
            return parent;
          }
        }
        return false;
      },
      activeStyle() {
        return {
          backgroundColor: this._radioGroup.fill || '',
          borderColor: this._radioGroup.fill || '',
          boxShadow: this._radioGroup.fill ? `-1px 0 0 0 ${this._radioGroup.fill}` : '',
          color: this._radioGroup.textColor || ''
        };
      },
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      size() {
        return this._radioGroup.radioGroupSize || this._elFormItemSize || (this.$ELEMENT || {}).size;
      },
      isDisabled() {
        return this.disabled || this._radioGroup.disabled || (this.elForm || {}).disabled;
      },
      tabIndex() {
        return (this.isDisabled || (this._radioGroup && this.value !== this.label)) ? -1 : 0;
      }
    },

    methods: {
      handleChange() {
        this.$nextTick(() => {
          this.dispatch('ElRadioGroup', 'handleChange', this.value);
        });
      }
    }*/
  };
</script>
