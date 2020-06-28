<template>
  <div :class="[
    type === 'textarea' ? 'el-textarea' : 'el-input',
    inputSize ? 'el-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled,
      'is-exceed': inputExceed,
      'el-input-group': slots.prepend || slots.append,
      'el-input-group--append': slots.append,
      'el-input-group--prepend': slots.prepend,
      'el-input--prefix': slots.prefix || prefixIcon,
      'el-input--suffix': slots.suffix || suffixIcon || clearable || showPassword
    }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="el-input-group__prepend" v-if="slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input
        :tabindex="tabindex"
        v-if="type !== 'textarea'"
        class="el-input__inner"
        v-bind="attrs"
        :type="showPassword ? (passwordVisible ? 'text': 'password') : type"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autoComplete || autocomplete"
        ref="input"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-label="label"
      >
      <!-- 前置内容 -->
      <span class="el-input__prefix" v-if="slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="el-input__icon"
           v-if="prefixIcon"
           :class="prefixIcon">
        </i>
      </span>
      <!-- 后置内容 -->
      <span
        class="el-input__suffix"
        v-if="getSuffixVisible()">
        <span class="el-input__suffix-inner">
          <template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
            <slot name="suffix"></slot>
            <i class="el-input__icon"
              v-if="suffixIcon"
              :class="suffixIcon">
            </i>
          </template>
          <i v-if="showClear"
            class="el-input__icon el-icon-circle-close el-input__clear"
            @mousedown.prevent
            @click="clear"
          ></i>
          <i v-if="showPwdVisible"
            class="el-input__icon el-icon-view el-input__clear"
            @click="handlePasswordVisible"
          ></i>
          <span v-if="isWordLimitVisible" class="el-input__count">
            <span class="el-input__count-inner">
              {{ textLength }}/{{ upperLimit }}
            </span>
          </span>
        </span>
        <i class="el-input__icon"
          v-if="validateState"
          :class="['el-input__validateIcon', validateIcon]">
        </i>
      </span>
      <!-- 后置元素 -->
      <div class="el-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      :tabindex="tabindex"
      class="el-textarea__inner"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      ref="textarea"
      v-bind="attrs"
      :disabled="inputDisabled"
      :readonly="readonly"
      :autocomplete="autoComplete || autocomplete"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label"
    >
    </textarea>
    <span v-if="isWordLimitVisible && type === 'textarea'" class="el-input__count">{{ textLength }}/{{ upperLimit }}</span>
    <el-autocomplete-suggestions
      visible-arrow
      :class="[popperClass ? popperClass : '']"
      :popper-options="popperOptions"
      :append-to-body="popperAppendToBody"
      ref="suggestions"
      :placement="placement"
      :id="id"
    >

    </el-autocomplete-suggestions>
  </div>
</template>
<script>
  import { ref,toRef, reactive, computed, watch, watchEffect, nextTick, getCurrentInstance, onMounted, onUpdated, inject,provide } from 'vue'
  import {useElForm} from "packages/form/src/form";
  import {useElFormItem} from "packages/form/src/form-item";
  import {useELEMENT} from "src/index";
  import emitter from 'src/mixins/emitter';
  import Migrating from 'src/mixins/migrating';
  import calcTextareaHeight from './calcTextareaHeight';
  import merge from 'src/utils/merge';
  import {isKorean} from 'src/utils/shared';
  import ElAutocompleteSuggestions from './autocomplete-suggestions'

  const INPUTSYMBOL = Symbol('Input')

  export function useInput() {
    return inject(INPUTSYMBOL)
  }

  export default {
    name: 'ElInput',

    componentName: 'ElInput',

    // mixins: [emitter, Migrating],

    inheritAttrs: false,

    components: {
      ElAutocompleteSuggestions
    },

    /*inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },*/

    /*data() {
      return {
        textareaCalcStyle: {},
        hovering: false,
        focused: false,
        isComposing: false,
        passwordVisible: false
      };
    },*/

    props: {
      modelValue: [String, Number],
      size: String,
      resize: String,
      form: String,
      disabled: Boolean,
      readonly: Boolean,
      type: {
        type: String,
        default: 'text'
      },
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      autocomplete: {
        type: String,
        default: 'off'
      },
      /** @Deprecated in next major version */
      autoComplete: {
        type: String,
        validator(val) {
          process.env.NODE_ENV !== 'production' &&
            console.warn('[Element Warn][Input]\'auto-complete\' property will be deprecated in next major version. please use \'autocomplete\' instead.');
          return true;
        }
      },
      validateEvent: {
        type: Boolean,
        default: true
      },
      suffixIcon: String,
      prefixIcon: String,
      label: String,
      clearable: {
        type: Boolean,
        default: false
      },
      showPassword: {
        type: Boolean,
        default: false
      },
      showWordLimit: {
        type: Boolean,
        default: false
      },
      popperClass: String,
      popperOptions: Object,
      tabindex: String,
      popperAppendToBody: {
        type: Boolean,
        default: true
      },
      highlightFirstItem: {
        type: Boolean,
        default: false
      }
    },

    setup(props, ctx) {
      const instance = getCurrentInstance()
      const elForm = useElForm()
      const elFormItem = useElFormItem()
      const ELEMENT = useELEMENT()
      const textareaCalcStyle = reactive({})
      const hovering = ref(false)
      const focused = ref(false)
      const isComposing = ref(false)
      const passwordVisible = ref(false)
      const input = ref(null)
      const textarea = ref(null)
      const isServer = ref(false)
      const model = ref(props.modelValue)
      console.log(props.modelValue)

      // computed
      const _elFormItemSize = computed(() => {
        return (elFormItem || {}).elFormItemSize;
      })
      const validateState = computed(() => {
        return elFormItem ? elFormItem.validateState : '';
      })
      const textareaStyle = computed(() => {
        return merge({}, textareaCalcStyle.value, { resize: props.resize });
      })
      const inputSize = computed(() => {
        return props.size || _elFormItemSize.value || (ELEMENT || {}).size;
      })
      const inputDisabled = computed(() => {
        return props.disabled || (elForm || {}).disabled;
      })
      const needStatusIcon = computed(() => {
        return elForm ? elForm.statusIcon : false;
      })
      const validateIcon = computed(() => {
        return {
          validating: 'el-icon-loading',
          success: 'el-icon-circle-check',
          error: 'el-icon-circle-close'
        }[validateState.value];
      })
      const nativeInputValue = computed(() => {
        return props.modelValue === null || props.modelValue === undefined ? '' : String(props.modelValue);
      })
      const showClear = computed(() => {
        return props.clearable &&
          !inputDisabled.value &&
          !props.readonly &&
          nativeInputValue.value &&
          (focused.value || hovering.value);
      })
      const showPwdVisible = computed(() => {
        return props.showPassword &&
          !inputDisabled.value &&
          !props.readonly &&
          (!!nativeInputValue.value || focused.value);
      })

      const isWordLimitVisible = computed(() => {
        return props.showWordLimit &&
          ctx.attrs.maxlength &&
          (props.type === 'text' || props.type === 'textarea') &&
          !inputDisabled.value &&
          !props.readonly &&
          !props.showPassword;
      })

      const upperLimit= computed(() => {
        return ctx.attrs.maxlength;
      })
      const textLength = computed(() =>{
        if (typeof props.modelValue === 'number') {
          return String(props.modelValue).length;
        }

        return (props.modelValue || '').length;
      })
      const inputExceed = computed(()=> {
        // show exceed style if length of initial value greater then maxlength
        return isWordLimitVisible.value &&
          (textLength.value > upperLimit.value);
      })

      // methods
      function focus() {
        getInput().focus();
      }
      function blur() {
        getInput().blur();
      }
      function getMigratingConfig() {
        return {
          props: {
            'icon': 'icon is removed, use suffix-icon / prefix-icon instead.',
            'on-icon-click': 'on-icon-click is removed.'
          },
          events: {
            'click': 'click is removed.'
          }
        };
      }
      function handleBlur(event) {
        focused.value = false;
        ctx.emit('blur', event);
        if (props.validateEvent) {
          // this.dispatch('ElFormItem', 'el.form.blur', [this.value]);
          elFormItem?.onFieldBlur()
        }
      }
      function select() {
        getInput().select();
      }
      function resizeTextarea() {
        if (isServer.value) return;
        const { autosize, type } = props;
        if (type !== 'textarea') return;
        if (!autosize) {
          textareaCalcStyle.value = {
            minHeight: calcTextareaHeight(textarea.value).minHeight
          };
          return;
        }
        const minRows = autosize.minRows;
        const maxRows = autosize.maxRows;

        textareaCalcStyle.value = calcTextareaHeight(textarea.value, minRows, maxRows);
      }
      function setNativeInputValue() {
        const input = getInput();
        if (!input) return;
        if (input.value === nativeInputValue.value) return;
        input.value = nativeInputValue.value;
      }
      function handleFocus(event) {
        focused.value = true;
        ctx.emit('focus', event);
      }
      function handleCompositionStart() {
        isComposing.value = true;
      }
      function handleCompositionUpdate(event) {
        const text = event.target.value;
        const lastCharacter = text[text.length - 1] || '';
        isComposing.value = !isKorean(lastCharacter);
      }
      function handleCompositionEnd(event) {
        if (isComposing.value) {
          isComposing.value = false;
          handleInput(event);
        }
      }
      function handleInput(event) {
        // should not emit input during composition
        // see: https://github.com/ElemeFE/element/issues/10516
        if (isComposing.value) return;

        // hack for https://github.com/ElemeFE/element/issues/8548
        // should remove the following line when we don't support IE
        if (event.target.value === nativeInputValue.value) return;

        // ctx.emit('input', event.target.value);
        ctx.emit('update:modelValue', event.target.value)
        // ensure native input value is controlled
        // see: https://github.com/ElemeFE/element/issues/12850
        nextTick(() => {
          setNativeInputValue()
        })
      }
      function handleChange(event) {
        ctx.emit('change', event.target.value);
      }
      function calcIconOffset(place) {
        let elList = [].slice.call(instance.vnode.el.querySelectorAll(`.el-input__${place}`) || []);
        if (!elList.length) return;
        let el = null;
        for (let i = 0; i < elList.length; i++) {
          if (elList[i].parentNode === instance.vnode.el) {
            el = elList[i];
            break;
          }
        }
        if (!el) return;
        const pendantMap = {
          suffix: 'append',
          prefix: 'prepend'
        };

        const pendant = pendantMap[place];
        if (ctx.slots[pendant]) {
          el.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${instance.vnode.el.querySelector(`.el-input-group__${pendant}`).offsetWidth}px)`;
        } else {
          el.removeAttribute('style');
        }
      }
      function updateIconOffset() {
        calcIconOffset('prefix');
        calcIconOffset('suffix');
      }
      function clear() {
        ctx.emit('update:modelValue', '');
        ctx.emit('change', '');
        ctx.emit('clear');
      }
      function handlePasswordVisible() {
        passwordVisible.value = !passwordVisible.value;
        focus();
      }
      function getInput() {
        return input.value || textarea.value
      }
      function getSuffixVisible() {
        return ctx.slots.suffix ||
          props.suffixIcon ||
          showClear.value ||
          props.showPassword ||
          isWordLimitVisible.value ||
          (validateState.value && needStatusIcon.value);
      }
      function itemClick(item) {

      }

      // watch
      watch(toRef(props, 'modelValue'), (val) => {
        nextTick(resizeTextarea)
        elFormItem?.onFieldChange()
      })
      watch(nativeInputValue, () => {
        setNativeInputValue()
      })
      watch(toRef(props,'type'), () => {
        nextTick( () => {
          setNativeInputValue();
          resizeTextarea();
          updateIconOffset();
        })
      })
      onMounted( () => {
        setNativeInputValue();
        resizeTextarea();
        updateIconOffset();
      })
      onUpdated(() => {
        nextTick(updateIconOffset);
      })

      provide(INPUTSYMBOL, {
        instance,
        inputElm: input,
        itemClick
      })
      return {
        slots: ctx.slots,
        attrs: ctx.attrs,
        showClear,
        showPwdVisible,
        passwordVisible,
        isWordLimitVisible,
        inputSize,
        inputDisabled,
        inputExceed,
        input,
        textarea,
        validateState,
        upperLimit,
        validateIcon,
        textareaStyle,
        handleInput,
        handleCompositionStart,
        handleCompositionUpdate,
        handleCompositionEnd,
        clear,
        handlePasswordVisible,
        getSuffixVisible,
        handleBlur,
        handleChange,
        handleFocus,
      }
    },
    computed: {
      /*_elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },*/
      /*validateState() {
        return this.elFormItem ? this.elFormItem.validateState : '';
      },*/
      /*needStatusIcon() {
        return this.elForm ? this.elForm.statusIcon : false;
      },
      validateIcon() {
        return {
          validating: 'el-icon-loading',
          success: 'el-icon-circle-check',
          error: 'el-icon-circle-close'
        }[this.validateState];
      },*/
      /*textareaStyle() {
        return merge({}, this.textareaCalcStyle, { resize: this.resize });
      },
      inputSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      },
      inputDisabled() {
        return this.disabled || (this.elForm || {}).disabled;
      },*/
      /*nativeInputValue() {
        return this.value === null || this.value === undefined ? '' : String(this.value);
      },
      showClear() {
        return this.clearable &&
          !this.inputDisabled &&
          !this.readonly &&
          this.nativeInputValue &&
          (this.focused || this.hovering);
      },
      showPwdVisible() {
        return this.showPassword &&
          !this.inputDisabled &&
          !this.readonly &&
          (!!this.nativeInputValue || this.focused);
      },
      isWordLimitVisible() {
        return this.showWordLimit &&
          this.$attrs.maxlength &&
          (this.type === 'text' || this.type === 'textarea') &&
          !this.inputDisabled &&
          !this.readonly &&
          !this.showPassword;
      },
      upperLimit() {
        return this.$attrs.maxlength;
      },
      textLength() {
        if (typeof this.value === 'number') {
          return String(this.value).length;
        }

        return (this.value || '').length;
      },
      inputExceed() {
        // show exceed style if length of initial value greater then maxlength
        return this.isWordLimitVisible &&
          (this.textLength > this.upperLimit);
      }*/
    },

    /*watch: {
      value(val) {
        this.$nextTick(this.resizeTextarea);
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.change', [val]);
        }
      },
      // native input value is set explicitly
      // do not use v-model / :value in template
      // see: https://github.com/ElemeFE/element/issues/14521
      nativeInputValue() {
        this.setNativeInputValue();
      },
      // when change between <input> and <textarea>,
      // update DOM dependent value and styles
      // https://github.com/ElemeFE/element/issues/14857
      type() {
        this.$nextTick(() => {
          this.setNativeInputValue();
          this.resizeTextarea();
          this.updateIconOffset();
        });
      }
    },*/

    /*methods: {
      focus() {
        this.getInput().focus();
      },
      blur() {
        this.getInput().blur();
      },
      getMigratingConfig() {
        return {
          props: {
            'icon': 'icon is removed, use suffix-icon / prefix-icon instead.',
            'on-icon-click': 'on-icon-click is removed.'
          },
          events: {
            'click': 'click is removed.'
          }
        };
      },
      handleBlur(event) {
        this.focused = false;
        this.$emit('blur', event);
        if (this.validateEvent) {
          this.dispatch('ElFormItem', 'el.form.blur', [this.value]);
        }
      },
      select() {
        this.getInput().select();
      },
      resizeTextarea() {
        if (this.$isServer) return;
        const { autosize, type } = this;
        if (type !== 'textarea') return;
        if (!autosize) {
          this.textareaCalcStyle = {
            minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
          };
          return;
        }
        const minRows = autosize.minRows;
        const maxRows = autosize.maxRows;

        this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
      },
      setNativeInputValue() {
        const input = this.getInput();
        if (!input) return;
        if (input.value === this.nativeInputValue) return;
        input.value = this.nativeInputValue;
      },
      handleFocus(event) {
        this.focused = true;
        this.$emit('focus', event);
      },
      handleCompositionStart() {
        this.isComposing = true;
      },
      handleCompositionUpdate(event) {
        const text = event.target.value;
        const lastCharacter = text[text.length - 1] || '';
        this.isComposing = !isKorean(lastCharacter);
      },
      handleCompositionEnd(event) {
        if (this.isComposing) {
          this.isComposing = false;
          this.handleInput(event);
        }
      },
      handleInput(event) {
        // should not emit input during composition
        // see: https://github.com/ElemeFE/element/issues/10516
        if (this.isComposing) return;

        // hack for https://github.com/ElemeFE/element/issues/8548
        // should remove the following line when we don't support IE
        if (event.target.value === this.nativeInputValue) return;

        this.$emit('input', event.target.value);

        // ensure native input value is controlled
        // see: https://github.com/ElemeFE/element/issues/12850
        this.$nextTick(this.setNativeInputValue);
      },
      handleChange(event) {
        this.$emit('change', event.target.value);
      },
      calcIconOffset(place) {
        let elList = [].slice.call(this.$el.querySelectorAll(`.el-input__${place}`) || []);
        if (!elList.length) return;
        let el = null;
        for (let i = 0; i < elList.length; i++) {
          if (elList[i].parentNode === this.$el) {
            el = elList[i];
            break;
          }
        }
        if (!el) return;
        const pendantMap = {
          suffix: 'append',
          prefix: 'prepend'
        };

        const pendant = pendantMap[place];
        if (this.$slots[pendant]) {
          el.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${this.$el.querySelector(`.el-input-group__${pendant}`).offsetWidth}px)`;
        } else {
          el.removeAttribute('style');
        }
      },
      updateIconOffset() {
        this.calcIconOffset('prefix');
        this.calcIconOffset('suffix');
      },
      clear() {
        this.$emit('input', '');
        this.$emit('change', '');
        this.$emit('clear');
      },
      handlePasswordVisible() {
        this.passwordVisible = !this.passwordVisible;
        this.focus();
      },
      getInput() {
        return this.$refs.input || this.$refs.textarea;
      },
      getSuffixVisible() {
        return this.$slots.suffix ||
          this.suffixIcon ||
          this.showClear ||
          this.showPassword ||
          this.isWordLimitVisible ||
          (this.validateState && this.needStatusIcon);
      }
    },*/

    /*created() {
      this.$on('inputSelect', this.select);
    },*/

    /*mounted() {
      this.setNativeInputValue();
      this.resizeTextarea();
      this.updateIconOffset();
    },*/

    /*updated() {
      this.$nextTick(this.updateIconOffset);
    }*/
  }
</script>
