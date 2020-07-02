import { on, off } from 'src/utils/dom';
import { renderThumbStyle, BAR_MAP } from './util';
import { h, computed, ref, getCurrentInstance, onUnmounted } from 'vue';
import { useWrap } from './main';

/* istanbul ignore next */
export default {
  name: 'Bar',

  props: {
    vertical: Boolean,
    size: String,
    move: Number
  },

  /*computed: {
    bar() {
      return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
    },

    wrap() {
      return this.$parent.wrap;
    }
  },*/
  setup(props, ctx) {
    const instance = getCurrentInstance()
    // refs
    const thumb = ref(null)

    const  wrap = useWrap()
    // computed
    const bar = computed(() => {
      return BAR_MAP[props.vertical ? 'vertical' : 'horizontal'];
    })

    const axis = ref({})
    const cursorDown = ref(null)

    // methods
    function clickThumbHandler(e) {
      // prevent click event of right button
      if (e.ctrlKey || e.button === 2) {
        return;
      }
      // debugger
      startDrag(e);
      axis.value[bar.value.axis] = (e.currentTarget[bar.value.offset] - (e[bar.value.client] - e.currentTarget.getBoundingClientRect()[bar.value.direction]));
    }
    function clickTrackHandler(e) {
      const offset = Math.abs(e.target.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]);
      const thumbHalf = (thumb.value[bar.value.offset] / 2);
      const thumbPositionPercentage = ((offset - thumbHalf) * 100 / instance.vnode.el[bar.value.offset]);

      wrap.value[bar.value.scroll] = (thumbPositionPercentage * wrap.value[bar.value.scrollSize] / 100);
    }
    function startDrag(e) {
      e.stopImmediatePropagation();
      cursorDown.value = true;
      on(document, 'mousemove', mouseMoveDocumentHandler);
      on(document, 'mouseup', mouseUpDocumentHandler);
      document.onselectstart = () => false;
    }

    function mouseMoveDocumentHandler(e) {
      if (cursorDown.value === false) return;
      const prevPage = axis.value[bar.value.axis];

      if (!prevPage) return;

      const offset = ((instance.vnode.el.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]) * -1);
      const thumbClickPosition = (thumb.value[bar.value.offset] - prevPage);
      const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / instance.vnode.el[bar.value.offset]);
      // debugger

      wrap.value[bar.value.scroll] = (thumbPositionPercentage * wrap.value[bar.value.scrollSize] / 100);

    }

    function mouseUpDocumentHandler(e) {
      cursorDown.value = false;
      axis.value[bar.value.axis] = 0;
      off(document, 'mousemove', mouseMoveDocumentHandler);
      document.onselectstart = null;
    }

    function mouseover(e) {


    }

    function mouseout(e) {

    }

    onUnmounted(() => {
      off(document, 'mouseup', mouseUpDocumentHandler);
    })

    return () => h('div', {
      class: ['el-scrollbar__bar', 'is-' + bar.value.key],
      onMousedown: clickTrackHandler
    },
    h('div', {
      ref: thumb,
      class: 'el-scrollbar__thumb',
      onMousedown: clickThumbHandler,
      onMouseover: mouseover,
      onMouseout: mouseout,
      style: renderThumbStyle({
        size: props.size,
        move: props.move,
        bar: bar.value
      })
    })
    )
  },

  /* render() {
    const { size, move, bar } = this.$props;

    return
      <div
        class={ ['el-scrollbar__bar', 'is-' + bar.key] }
        onMousedown={ this.clickTrackHandler } >
        <div
          ref="thumb"
          class="el-scrollbar__thumb"
          onMousedown={ this.clickThumbHandler }
          style={ renderThumbStyle({ size, move, bar }) }>
        </div>
      </div>

  }, */

  /* methods: {
     clickThumbHandler(e) {
      // prevent click event of right button
      if (e.ctrlKey || e.button === 2) {
        return;
      }
      this.startDrag(e);
      this[this.bar.axis] = (e.currentTarget[this.bar.offset] - (e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction]));
    },

    clickTrackHandler(e) {
      const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
      const thumbHalf = (this.$refs.thumb[this.bar.offset] / 2);
      const thumbPositionPercentage = ((offset - thumbHalf) * 100 / this.$el[this.bar.offset]);

      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
    },

    startDrag(e) {
      e.stopImmediatePropagation();
      this.cursorDown = true;

      on(document, 'mousemove', this.mouseMoveDocumentHandler);
      on(document, 'mouseup', this.mouseUpDocumentHandler);
      document.onselectstart = () => false;
    },

    mouseMoveDocumentHandler(e) {
      if (this.cursorDown === false) return;
      const prevPage = this[this.bar.axis];

      if (!prevPage) return;

      const offset = ((this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1);
      const thumbClickPosition = (this.$refs.thumb[this.bar.offset] - prevPage);
      const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / this.$el[this.bar.offset]);

      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
    },

    mouseUpDocumentHandler(e) {
      this.cursorDown = false;
      this[this.bar.axis] = 0;
      off(document, 'mousemove', this.mouseMoveDocumentHandler);
      document.onselectstart = null;
    }
  }, */

  /*  destroyed() {
  }*/
};
