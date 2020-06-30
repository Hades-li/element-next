// reference https://github.com/noeldelgado/gemini-scrollbar/blob/master/index.js

import {h,ref,computed} from 'vue'
import { addResizeListener, removeResizeListener } from 'src/utils/resize-event';
import scrollbarWidth from 'src/utils/scrollbar-width';
import { toObject } from 'src/utils/util';
import Bar from './bar';

/* istanbul ignore next */
export default {
  name: 'ElScrollbar',

  components: { Bar },

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
    const sizeWidth =  ref('0')
    const sizeHeight =  ref('0')
    const moveX =  ref(0)
    const moveY =  ref(0)
    // const wrap = ref(null)

    /*function render() {
      let gutter = scrollbarWidth();
      let style = props.wrapStyle;

      if (gutter) {
        const gutterWith = `-${gutter}px`;
        const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;

        if (Array.isArray(props.wrapStyle)) {
          style = toObject(props.wrapStyle);
          style.marginRight = style.marginBottom = gutterWith;
        } else if (typeof props.wrapStyle === 'string') {
          style += gutterStyle;
        } else {
          style = gutterStyle;
        }
      }
      const view = h(props.tag, {
        class: ['el-scrollbar__view', props.viewClass],
        style: props.viewStyle,
        ref: 'resize'
      }, ctx.slots);
      const wrap =
        <div
          ref="wrap"
          style={ style }
          onScroll={ handleScroll }
          className={ [props.wrapClass, 'el-scrollbar__wrap', gutter ? '' : 'el-scrollbar__wrap--hidden-default'] }>
          { view }
        </div>

      let nodes;

      if (!this.native) {
        nodes = ([
          wrap,
          <Bar
            move={ moveX.value }
            size={ sizeWidth.value }>

          </Bar>,
          <Bar
            vertical
            move={ moveY.value }
            size={ sizeHeight.value }>
          </Bar>
        ]);
      } else {
        nodes = ([
          <div
            ref="wrap"
            class={ [props.wrapClass, 'el-scrollbar__wrap'] }
            style={ style }>
            { [view] }
          </div>
        ])
      }
      function handleScroll() {
        // const wrap = this.wrap;
        this.moveY = ((wrap.scrollTop * 100) / wrap.clientHeight);
        this.moveX = ((wrap.scrollLeft * 100) / wrap.clientWidth);
      }

      function update() {
        let heightPercentage, widthPercentage;
        const wrap = this.wrap;
        if (!wrap) return;

        heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight);
        widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth);

        sizeHeight.value = (heightPercentage < 100) ? (heightPercentage + '%') : '';
        sizeWidth.value = (widthPercentage < 100) ? (widthPercentage + '%') : '';
      }
      return h('div', { class: 'el-scrollbar' }, nodes);
    }*/

    return () => <div>123</div>
  },

  methods: {
    /*handleScroll() {
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
    }*/
  },

  /*mounted() {
    if (this.native) return;
    this.$nextTick(this.update);
    !this.noresize && addResizeListener(this.$refs.resize, this.update);
  },*/

  /*beforeDestroy() {
    if (this.native) return;
    !this.noresize && removeResizeListener(this.$refs.resize, this.update);
  }*/
};
