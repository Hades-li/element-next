import { computed, h } from 'vue'
export default {
  name: 'ElRow',

  componentName: 'ElRow',

  props: {
    tag: {
      type: String,
      default: 'div'
    },
    gutter: Number,
    type: String,
    justify: {
      type: String,
      default: 'start'
    },
    align: {
      type: String,
      default: 'top'
    }
  },
  setup(props, ctx) {
    const style = () => computed(() => {
      const ret = {};

      if (this.gutter) {
        ret.marginLeft = `-${props.gutter / 2}px`;
        ret.marginRight = ret.marginLeft;
      }

      return ret;
    })

    return () => h(props.tag, {
      class: [
        'el-row',
        props.justify !== 'start' ? `is-justify-${props.justify}` : '',
        props.align !== 'top' ? `is-align-${props.align}` : '',
        { 'el-row--flex': props.type === 'flex' }
      ],
      style
    }, ctx.slots);
  },
  /*computed: {
    style() {
      const ret = {};

      if (this.gutter) {
        ret.marginLeft = `-${this.gutter / 2}px`;
        ret.marginRight = ret.marginLeft;
      }

      return ret;
    }
  },*/

  /*render() {
    return h(this.tag, {
      class: [
        'el-row',
        this.justify !== 'start' ? `is-justify-${this.justify}` : '',
        this.align !== 'top' ? `is-align-${this.align}` : '',
        { 'el-row--flex': this.type === 'flex' }
      ],
      style: this.style
    }, this.$slots.default);
  }*/
};
