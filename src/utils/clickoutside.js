import { on } from 'src/utils/dom';
import {resolveDirective, withDirectives} from 'vue'
const nodeList = [];
const ctx = '@@clickoutsideContext';

let startClick;
let seed = 0;
const isServer = false

!isServer && on(document, 'mousedown', e => {
  return (startClick = e)
});

!isServer && on(document, 'mouseup', e => {
  nodeList.forEach(node => {
    node[ctx].documentHandler(e, startClick)
  });
});

function createDocumentHandler(el, binding, vnode) {
  return function(mouseup = {}, mousedown = {}) {
    const instance = binding.instance
    const popperEl = instance.suggestionsComponent?.$el
    console.log(binding.instance)
    if (!vnode ||
      !instance ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target ||
      (popperEl &&
      (popperEl.contains(mouseup.target) ||
        popperEl.contains(mousedown.target)))) return;

    if (binding.value &&
      el[ctx].methodName &&
      instance[el[ctx].methodName]) {
      instance[el[ctx].methodName]();
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn();
    }
  };
}

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-element-clickoutside="handleClose">
 * ```
 */
export default {
  beforeMount(el, binding, vnode) {
    // console.log(binding)
    console.log(vnode)
    nodeList.push(el);
    const id = seed++;
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.value.name,
      bindingFn: binding.value
    };
    console.log('v-clickout:', el[ctx])
  },

  updated(el, binding, vnode) {
    debugger
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
    el[ctx].methodName = binding.value.name;
    el[ctx].bindingFn = binding.value;
  },

  unmounted(el) {
    let len = nodeList.length;

    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1);
        break;
      }
    }
    delete el[ctx];
  }
};
