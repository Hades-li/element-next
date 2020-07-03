import { createPopper } from '@popperjs/core'
import { mergeProps,getCurrentInstance, onMounted,onUpdated,on } from 'vue'


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
/**
 *
 * @param referenceElement: 目标dom
 * @param popperElement: popper的dom
 * @param options: popper的属性配置
 */
export function usePopper(options) {
  let popper = undefined
  const instance = getCurrentInstance()

  function show() {
    const referenceElement = instance.parent.vnode.el
    const popperElement = instance.vnode.el
    if (!popper) {
      popper = createPopper(referenceElement, popperElement)
    }
  }

  function updatePopper () {
    if (popper) {
      return popper.update()
    } else {
      show()
    }
  }

  function destroyPopper() {
    if (popper) {
      popper.destroy()
      popper = null
    }
  }

  return {
    show,
    updatePopper,
    destroyPopper
  }
}
