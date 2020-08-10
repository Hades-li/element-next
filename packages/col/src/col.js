import { computed,h, inject } from 'vue'
import {useGutter} from '../../row/src/row'

export default {
  name: 'ElCol',

  props: {
    span: {
      type: Number,
      default: 24
    },
    tag: {
      type: String,
      default: 'div'
    },
    offset: Number,
    pull: Number,
    push: Number,
    xs: [Number, Object],
    sm: [Number, Object],
    md: [Number, Object],
    lg: [Number, Object],
    xl: [Number, Object]
  },
  setup(props, ctx){
    const gutterRow = useGutter()
    const gutter = computed(() => {
      return gutterRow ? gutterRow : 0;
    })

    return () => {
      let classList = [];
      let style = {};

      if (gutter.value) {
        style.paddingLeft = gutter.value / 2 + 'px';
        style.paddingRight = style.paddingLeft;
      }

      ['span', 'offset', 'pull', 'push'].forEach(prop => {
        if (props[prop] || props[prop] === 0) {
          classList.push(
            prop !== 'span'
              ? `el-col-${prop}-${props[prop]}`
              : `el-col-${props[prop]}`
          );
        }
      });

      ['xs', 'sm', 'md', 'lg', 'xl'].forEach(size => {
        if (typeof props[size] === 'number') {
          classList.push(`el-col-${size}-${props[size]}`);
        } else if (typeof props[size] === 'object') {
          let props = props[size];
          Object.keys(props).forEach(prop => {
            classList.push(
              prop !== 'span'
                ? `el-col-${size}-${prop}-${props[prop]}`
                : `el-col-${size}-${props[prop]}`
            );
          });
        }
      });

      return h(props.tag, {
        class: ['el-col', classList],
        style
      }, ctx.slots?.default());
    }
  },

  /*computed: {
    gutter() {
      let parent = this.$parent;
      while (parent && parent.$options.componentName !== 'ElRow') {
        parent = parent.$parent;
      }
      return parent ? parent.gutter : 0;
    }
  },*/
  /*render(h) {
    let classList = [];
    let style = {};

    if (this.gutter) {
      style.paddingLeft = this.gutter / 2 + 'px';
      style.paddingRight = style.paddingLeft;
    }

    ['span', 'offset', 'pull', 'push'].forEach(prop => {
      if (this[prop] || this[prop] === 0) {
        classList.push(
          prop !== 'span'
            ? `el-col-${prop}-${this[prop]}`
            : `el-col-${this[prop]}`
        );
      }
    });

    ['xs', 'sm', 'md', 'lg', 'xl'].forEach(size => {
      if (typeof this[size] === 'number') {
        classList.push(`el-col-${size}-${this[size]}`);
      } else if (typeof this[size] === 'object') {
        let props = this[size];
        Object.keys(props).forEach(prop => {
          classList.push(
            prop !== 'span'
              ? `el-col-${size}-${prop}-${props[prop]}`
              : `el-col-${size}-${props[prop]}`
          );
        });
      }
    });

    return h(this.tag, {
      class: ['el-col', classList],
      style
    }, this.$slots.default);
  }*/
};
