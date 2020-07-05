import {createPopper} from '@popperjs/core'
import {getCurrentInstance, mergeProps, onMounted, ref} from 'vue'
import {PopupManager} from 'src/utils/popup';

const defaultOptions = {
  placement: 'bottom-start',
  strategy: 'fixed',
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 10],
      },
    },
    {
      name: 'computeStyles',
      options: {
        gpuAcceleration: false, // true by default
      },
    },
    {
      name: 'arrow',
      options: {
        element: 'popper__arrow',
      },
    }
  ]
}
const defaultProps = {
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
  reference: {
    type: Object,
    default: null
  },
  popper: {
    type: Object,
    default: null
  },
  popperOptions: {
    type: Object,
    default: null
  }
}

let appended = false

export function mixinProps(props) {
  return mergeProps(defaultProps, props)
}

function mixinOptions(opts) {

  return mergeProps(defaultOptions, ...arguments)
}

function appendArrow(element) {
  let hash;
  if (appended) {
    return;
  }

  appended = true;

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

/**
 *
 * @param props: popper的属性配置
 */
export function usePopper(props) {
  let referenceElement = undefined
  let popperElement = undefined
  const showPopper = ref(false)
  const placement = ref('')
  const instance = getCurrentInstance()
  const zIndex = PopupManager.nextZIndex()
  const options = mixinOptions(props.popperOptions) // popper插件的配置

  let popper = undefined // created popper

  function setStyle(popperElement) {
    if (!popper) return
    const placementMap = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left'
    }
    placement.value = popper.state.placement.split('-')[0]
    const origin = placementMap[placement.value]
    popperElement.style.transformOrigin = typeof props.transformOrigin === 'string'
      ? props.transformOrigin
      : ['top', 'bottom'].indexOf(placement.value) > -1 ? `center ${origin}` : `${origin} center`;
    popperElement.style.zIndex = zIndex
  }

  function show() {
    referenceElement = props.reference || instance.parent.vnode.el
    popperElement = props.popper || instance.vnode.el

    if (!popper) {
      showPopper.value = true
      popper = createPopper(referenceElement, popperElement, options)
      popper.update().then(() => {
        setStyle(popperElement)
      })
    }
    if (props.visibleArrow) {
      appendArrow(popperElement)
    }
  }

  function update() {
    if (popper) {
      return popper.update().then(() => {
        setStyle(popperElement)
      })
    } else {
      show()
    }
  }

  function destroy() {
    if (popper) {
      popper.destroy()
      popper = null
    }
  }

  return {
    showPopper, // 返回一个显示状态
    placement,
    show,
    update,
    destroy
  }
}
