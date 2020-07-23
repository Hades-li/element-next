<script>
  import { h } from 'vue'

  export default {
    name: 'ElTag',
    props: {
      text: String,
      closable: Boolean,
      type: String,
      hit: Boolean,
      disableTransitions: Boolean,
      color: String,
      size: String,
      effect: {
        type: String,
        default: 'light',
        validator(val) {
          return ['dark', 'light', 'plain'].indexOf(val) !== -1;
        }
      }
    },
    methods: {
      handleClose(event) {
        event.stopPropagation();
        this.$emit('close', event);
      },
      handleClick(event) {
        this.$emit('click', event);
      }
    },
    computed: {
      tagSize() {
        return this.size || (this.$ELEMENT || {}).size;
      }
    },
    render() {
      const { type, tagSize, hit, effect } = this;
      const classes = [
        'el-tag',
        type ? `el-tag--${type}` : '',
        tagSize ? `el-tag--${tagSize}` : '',
        effect ? `el-tag--${effect}` : '',
        hit && 'is-hit'
      ];
      /*const tagEl =
        <span
          class={ classes }
          style={{ backgroundColor: this.color }}
          on-click={ this.handleClick }>
          { this.$slots.default }
          {
            this.closable && <i class="el-tag__close el-icon-close" on-click={ this.handleClose }></i>
          }
        </span>*/
      const child = h('i', {
        class: 'el-tag__close el-icon-close',
        onClick: this.handleClose
      })
      console.log(this.$slots.default())
      const tagEl = h('span', {
        class: classes,
        style: {backgroundColor: this.color},
        onClick: this.handleClick,
      }, [this.$slots.default(),child] )

      return this.disableTransitions ? tagEl : h('transition', {
        name: 'el-zoom-in-center'
      },[tagEl])
      /*<transition name="el-zoom-in-center">{ tagEl }</transition>*/
      // return tagEl
    }
  };
</script>
