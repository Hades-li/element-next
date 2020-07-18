// reference https://github.com/noeldelgado/gemini-scrollbar/blob/master/index.js

import {h, ref, onMounted, onBeforeUnmount, nextTick, provide, inject} from 'vue'
import {addResizeListener, removeResizeListener} from 'src/utils/resize-event'
import scrollbarWidth from 'src/utils/scrollbar-width'
import {toObject} from 'src/utils/util'
import Bar from './bar'

const WRAPSYMBOL = Symbol()

// 将wrap的dom节点提供给子组件
export function useWrap() {
  return inject(WRAPSYMBOL)
}

/* istanbul ignore next */
export default {
  name: 'ElScrollbar',

  components: {Bar},

  props: {
    native: Boolean,
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: 'div'
    }
  },

  /*data() {
    return {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0
    };
  },*/

  /*computed: {
    wrap() {
      return this.$refs.wrap;
    }
  },*/
  setup(props, ctx) {
    const sizeWidth = ref('0')
    const sizeHeight = ref('0')
    const moveX = ref(0)
    const moveY = ref(0)
    const wrap = ref(null)
    const resize = ref(null)

    // methods
    function handleScroll(e) {
      const target = e.target
      // const wrap = this.wrap;
      moveY.value = ((wrap.value.scrollTop * 100) / wrap.value.clientHeight)
      moveX.value = ((wrap.value.scrollLeft * 100) / wrap.value.clientWidth)
      ctx.emit('scroll', {
        scrollTop: target.scrollTop,
        scrollLeft: target.scrollLeft
      })
    }

    function update() {
      let heightPercentage, widthPercentage
      // const wrap = this.wrap
      if (!wrap.value) return

      heightPercentage = (wrap.value.clientHeight * 100 / wrap.value.scrollHeight)
      widthPercentage = (wrap.value.clientWidth * 100 / wrap.value.scrollWidth)

      sizeHeight.value = (heightPercentage < 100) ? (heightPercentage + '%') : ''
      sizeWidth.value = (widthPercentage < 100) ? (widthPercentage + '%') : ''
    }

    onMounted(() => {
      if (props.native) return
      nextTick(update)
      !props.noresize && addResizeListener(resize.value, update)
    })

    onBeforeUnmount(() => {
      if (props.native) return
      !props.noresize && removeResizeListener(resize.value, update)
    })

    function render() {
      let gutter = scrollbarWidth()
      let style = props.wrapStyle
      // debugger
      if (gutter) {
        const gutterWith = `-${gutter}px`
        const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`

        if (Array.isArray(props.wrapStyle)) {
          style = toObject(props.wrapStyle)
          style.marginRight = style.marginBottom = gutterWith
        } else if (typeof props.wrapStyle === 'string') {
          style += gutterStyle
        } else {
          style = gutterStyle
        }
      }
      const view = h(props.tag, {
        class: ['el-scrollbar__view', props.viewClass],
        style: props.viewStyle,
        ref: resize
      }, ctx.slots.default())
      /*const wrap =
        <div
          ref="wrap"
          style={ style }
          onScroll={ handleScroll }
          className={ [props.wrapClass, 'el-scrollbar__wrap', gutter ? '' : 'el-scrollbar__wrap--hidden-default'] }>
          { view }
        </div>*/
      const _wrap = h('div', {
        ref: wrap,
        style,
        onScroll: handleScroll,
        class: [props.wrapClass, 'el-scrollbar__wrap', gutter ? '' : 'el-scrollbar__wrap--hidden-default']
      }, [view])

      let nodes = undefined

      if (!props.native) {
        // debugger
        /*nodes = ([
          wrap,
          <Bar
            move={moveX.value}
            size={sizeWidth.value}>

          </Bar>,
          <Bar
            vertical
            move={moveY.value}
            size={sizeHeight.value}>
          </Bar>
        ])*/
        nodes = [
          _wrap,
          h(Bar,
            {
              move: moveX.value,
              size: sizeWidth.value
            }),
          h(Bar,
            {
              vertical: true,
              move: moveY.value,
              size: sizeHeight.value
            })
        ]
      } else {
        /*nodes = ([
          <div
            ref="wrap"
            class={[props.wrapClass, 'el-scrollbar__wrap']}
            style={style}>
            {[view]}
          </div>
        ])*/
        nodes = [
          h('div',
            {
              ref: wrap,
              class: [props.wrapClass, 'el-scrollbar__wrap'],
              style,
            }, [view])
        ]
      }

      return h('div', {class: 'el-scrollbar'}, nodes)
    }

    provide(WRAPSYMBOL, wrap)

    onMounted(() => {

    })

    return render
  },

  /* methods: {
    handleScroll() {
      const wrap = this.wrap;

      this.moveY = ((wrap.scrollTop * 100) / wrap.clientHeight);
      this.moveX = ((wrap.scrollLeft * 100) / wrap.clientWidth);
    },

    update() {
      let heightPercentage, widthPercentage;
      const wrap = this.wrap;
      if (!wrap) return;

      heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight);
      widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth);

      this.sizeHeight = (heightPercentage < 100) ? (heightPercentage + '%') : '';
      this.sizeWidth = (widthPercentage < 100) ? (widthPercentage + '%') : '';
    }
  }, */

  /*mounted() {
    if (this.native) return;
    this.$nextTick(this.update);
    !this.noresize && addResizeListener(this.$refs.resize, this.update);
  },*/

  /*beforeDestroy() {
    if (this.native) return;
    !this.noresize && removeResizeListener(this.$refs.resize, this.update);
  }*/
}
