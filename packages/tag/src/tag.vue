<script>
  import {h, computed, Transition,ref} from 'vue'
  import {useELEMENT} from "src/index"
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
          return ['dark', 'light', 'plain'].indexOf(val) !== -1
        }
      }
    },
    setup(props, ctx) {
      const show = ref(true)
      // const {type, hit, effect} = props
      const ELEMENT = useELEMENT()
      // computed
      const tagSize = computed(() => {
        return props.size || (ELEMENT || {}).size
      })

      // methods
      function handleClose(event) {
        event.stopPropagation()
        ctx.emit('close', event)
      }

      function handleClick(event) {
        ctx.emit('click', event)
      }

      const classes = [
        'el-tag',
        props.type ? `el-tag--${props.type}` : '',
        tagSize.value ? `el-tag--${tagSize.value}` : '',
        props.effect ? `el-tag--${props.effect}` : '',
        props.hit && 'is-hit'
      ]

      const child = h('i', {
        class: 'el-tag__close el-icon-close',
        onClick: handleClose
      })
      const tagEl = h('span', {
        class: classes,
        style: {backgroundColor: props.color},
        onClick: handleClick,
      })

      return () => h(Transition, {
        name: 'el-zoom-in-center',
      }, [show.value && h(tagEl,[ctx.slots.default(), props.closable && child])])
    },
    /*methods: {
      handleClose(event) {
        event.stopPropagation();
        this.$emit('close', event);
      },
      handleClick(event) {
        this.$emit('click', event);
      }
    },*/
    /*computed: {},*/
    /*render() {
      const { type, tagSize, hit, effect } = this;
      const classes = [
        'el-tag',
        type ? `el-tag--${type}` : '',
        tagSize ? `el-tag--${tagSize}` : '',
        effect ? `el-tag--${effect}` : '',
        hit && 'is-hit'
      ]

      const child = h('i', {
        class: 'el-tag__close el-icon-close',
        onClick: this.handleClose
      })
      const tagEl = h('span', {
        class: classes,
        style: {backgroundColor: this.color},
        onClick: this.handleClick,
      }, [this.$slots.default(),child] )

      return this.disableTransitions ? tagEl : h('transition', {
        name: 'el-zoom-in-center'
      },[tagEl])
      /!*<transition name="el-zoom-in-center">{ tagEl }</transition>*!/
      // return tagEl
    }*/
  }
</script>
