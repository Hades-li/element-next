import {mergeProps, ref, watch,watchEffect,computed, onBeforeUnmount} from 'vue';
const isServer = false

import {
  PopupManager
} from 'src/utils/popup';

const PopperJS = isServer ? function() {} : require('./popper');
const stop = e => e.stopPropagation();

/**
 * @param props 原始的props
 */

export function mixinProps (props) {
   return mergeProps(
     {
     transformOrigin: {
       type: [Boolean, String],
       default: true
     },
     placement: {
       type: String,
       default: 'bottom'
     },
     boundariesPadding: {
       type: Number,
       default: 5
     },
     reference: {},
     popper: {},
     offset: {
       default: 0
     },
     modelValue: Boolean,
     visibleArrow: Boolean,
     arrowOffset: {
       type: Number,
       default: 35
     },
     appendToBody: {
       type: Boolean,
       default: true
     },
     popperOptions: {
       type: Object,
       default() {
         return {
           gpuAcceleration: false
         };
       }
     }
   }, props)
}

export function usePopper(props, ctx) {
  const showPopper = ref(false)
  const currentPlacement = ref('')
  const refPopper = ref(null)
  const refReference = ref(null)
  let reference = undefined
  let popperElm = undefined
  let popperJS = undefined
  let referenceElm = undefined
  // watch
  watchEffect(() => {
    showPopper.value = props.modelValue
    if (props.disabled) return;
    showPopper.value ? updatePopper() : destroyPopper();
    ctx.emit('input', showPopper.value);
  })
  function createPopper() {
    if (isServer) return;
    currentPlacement.value = currentPlacement.value || props.placement;
    if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(currentPlacement.value)) {
      return;
    }

    const options = props.popperOptions;
    const popper = popperElm = (popperElm || props.popper || refPopper.value)
    let reference = this.referenceElm = this.referenceElm || reference || refReference.value;

    if (!reference &&
      this.$slots.reference &&
      this.$slots.reference[0]) {
      reference = this.referenceElm = this.$slots.reference[0].elm;
    }

    if (!popper || !reference) return;
    if (this.visibleArrow) this.appendArrow(popper);
    if (this.appendToBody) document.body.appendChild(this.popperElm);
    if (this.popperJS && this.popperJS.destroy) {
      this.popperJS.destroy();
    }

    options.placement = this.currentPlacement;
    options.offset = this.offset;
    options.arrowOffset = this.arrowOffset;
    this.popperJS = new PopperJS(reference, popper, options);
    this.popperJS.onCreate(_ => {
      this.$emit('created', this);
      this.resetTransformOrigin();
      this.$nextTick(this.updatePopper);
    });
    if (typeof options.onUpdate === 'function') {
      this.popperJS.onUpdate(options.onUpdate);
    }
    this.popperJS._popper.style.zIndex = PopupManager.nextZIndex();
    this.popperElm.addEventListener('click', stop);
  }
  function updatePopper() {
    // const popperJS = this.popperJS;
    if (popperJS) {
      popperJS.update();
      if (popperJS._popper) {
        popperJS._popper.style.zIndex = PopupManager.nextZIndex();
      }
    } else {
      createPopper();
    }
  }
  function destroyPopper() {
    if (popperJS) {
      resetTransformOrigin();
    }
  }
  function resetTransformOrigin() {
    if (!props.transformOrigin) return;
    let placementMap = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left'
    }
    let placement = popperJS._popper.getAttribute('x-placement').split('-')[0];
    let origin = placementMap[placement];
    popperJS._popper.style.transformOrigin = typeof props.transformOrigin === 'string'
      ? props.transformOrigin
      : ['top', 'bottom'].indexOf(placement) > -1 ? `center ${ origin }` : `${ origin } center`;
  }
  function doDestroy(forceDestroy = false) {
    /* istanbul ignore if */
    if (!popperJS || (showPopper.value && !forceDestroy)) return;
    popperJS.destroy();
    popperJS = null;
  }
  onBeforeUnmount(() => {
    doDestroy(true);
    if (this.popperElm && this.popperElm.parentNode === document.body) {
      this.popperElm.removeEventListener('click', stop);
      document.body.removeChild(this.popperElm);
    }
  })
  return {
    showPopper,
    currentPlacement,
    doDestroy,
  }
}
export default {
  /*props: {
    transformOrigin: {
      type: [Boolean, String],
      default: true
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    boundariesPadding: {
      type: Number,
      default: 5
    },
    reference: {},
    popper: {},
    offset: {
      default: 0
    },
    value: Boolean,
    visibleArrow: Boolean,
    arrowOffset: {
      type: Number,
      default: 35
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    popperOptions: {
      type: Object,
      default() {
        return {
          gpuAcceleration: false
        };
      }
    }
  },*/

  /*data() {
    return {
      showPopper: false,
      currentPlacement: ''
    };
  },*/

  /*watch: {
    value: {
      immediate: true,
      handler(val) {
        this.showPopper = val;
        this.$emit('input', val);
      }
    },

    showPopper(val) {
      if (this.disabled) return;
      val ? this.updatePopper() : this.destroyPopper();
      this.$emit('input', val);
    }
  },*/

  methods: {
    /*createPopper() {
      if (this.$isServer) return;
      this.currentPlacement = this.currentPlacement || this.placement;
      if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.currentPlacement)) {
        return;
      }

      const options = this.popperOptions;
      const popper = this.popperElm = this.popperElm || this.popper || this.$refs.popper;
      let reference = this.referenceElm = this.referenceElm || this.reference || this.$refs.reference;

      if (!reference &&
        this.$slots.reference &&
        this.$slots.reference[0]) {
        reference = this.referenceElm = this.$slots.reference[0].elm;
      }

      if (!popper || !reference) return;
      if (this.visibleArrow) this.appendArrow(popper);
      if (this.appendToBody) document.body.appendChild(this.popperElm);
      if (this.popperJS && this.popperJS.destroy) {
        this.popperJS.destroy();
      }

      options.placement = this.currentPlacement;
      options.offset = this.offset;
      options.arrowOffset = this.arrowOffset;
      this.popperJS = new PopperJS(reference, popper, options);
      this.popperJS.onCreate(_ => {
        this.$emit('created', this);
        this.resetTransformOrigin();
        this.$nextTick(this.updatePopper);
      });
      if (typeof options.onUpdate === 'function') {
        this.popperJS.onUpdate(options.onUpdate);
      }
      this.popperJS._popper.style.zIndex = PopupManager.nextZIndex();
      this.popperElm.addEventListener('click', stop);
    },*/

    /*updatePopper() {
      const popperJS = this.popperJS;
      if (popperJS) {
        popperJS.update();
        if (popperJS._popper) {
          popperJS._popper.style.zIndex = PopupManager.nextZIndex();
        }
      } else {
        this.createPopper();
      }
    },*/

    /*doDestroy(forceDestroy) {
      /!* istanbul ignore if *!/
      if (!this.popperJS || (this.showPopper && !forceDestroy)) return;
      this.popperJS.destroy();
      this.popperJS = null;
    },*/

    /*destroyPopper() {
      if (this.popperJS) {
        this.resetTransformOrigin();
      }
    },*/

    /*resetTransformOrigin() {
      if (!this.transformOrigin) return;
      let placementMap = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left'
      };
      let placement = this.popperJS._popper.getAttribute('x-placement').split('-')[0];
      let origin = placementMap[placement];
      this.popperJS._popper.style.transformOrigin = typeof this.transformOrigin === 'string'
        ? this.transformOrigin
        : ['top', 'bottom'].indexOf(placement) > -1 ? `center ${ origin }` : `${ origin } center`;
    },*/

    appendArrow(element) {
      let hash;
      if (this.appended) {
        return;
      }

      this.appended = true;

      for (let item in element.attributes) {
        if (/^_v-/.test(element.attributes[item].name)) {
          hash = element.attributes[item].name;
          break;
        }
      }

      const arrow = document.createElement('div');

      if (hash) {
        arrow.setAttribute(hash, '');
      }
      arrow.setAttribute('x-arrow', '');
      arrow.className = 'popper__arrow';
      element.appendChild(arrow);
    }
  },

  /*beforeDestroy() {
    this.doDestroy(true);
    if (this.popperElm && this.popperElm.parentNode === document.body) {
      this.popperElm.removeEventListener('click', stop);
      document.body.removeChild(this.popperElm);
    }
  },*/

  // call destroy in keep-alive mode
  deactivated() {
    this.$options.beforeDestroy[0].call(this);
  }
};
