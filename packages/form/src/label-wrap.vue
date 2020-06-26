<script>
import { inject, watch, watchEffect, onMounted, onUpdated, onUnmounted, onBeforeUnmount, ref, getCurrentInstance, h } from 'vue'
import { useElFormItem } from './form-item'
import { useElForm } from './form'

export default {
  props: {
    isAutoWidth: Boolean,
    updateAll: Boolean
  },

  // inject: ['elForm', 'elFormItem'],

  /*render() {
    const slots = this.$slots.default;
    if (!slots) return null;
    if (this.isAutoWidth) {
      const autoLabelWidth = this.elForm.autoLabelWidth;
      const style = {};
      if (autoLabelWidth && autoLabelWidth !== 'auto') {
        const marginLeft = parseInt(autoLabelWidth, 10) - this.computedWidth;
        if (marginLeft) {
          style.marginLeft = marginLeft + 'px';
        }
      }
      return (<div class="el-form-item__label-wrap" style={style}>
        { slots }
      </div>)
    } else {
      return slots[0];
    }
  },*/
  setup (props, ctx) {
    const slots = ctx.slots.default()
    const elForm = useElForm()
    const instance = getCurrentInstance()
    const elFormItem = useElFormItem()
    const computedWidth = ref(0)
    // debugger
    // methods
    function getLabelWidth () {
      // console.log(instance)
      if (instance.vnode.el && instance.vnode.el.firstElementChild) {
        const computedWidth = window.getComputedStyle(instance.vnode.el.firstElementChild).width
        return Math.ceil(parseFloat(computedWidth))
      } else {
        return 0
      }
    }

    function updateLabelWidth (action = 'update') {
      if (slots && props.isAutoWidth && instance.vnode.el.firstElementChild) {
        if (action === 'update') {
          computedWidth.value = getLabelWidth()
        } else if (action === 'remove') {
          elForm.deregisterLabelWidth(computedWidth.value)
        }
      }
    }

    watch( computedWidth,(val, oldVal) => {
      if (props.updateAll) {
        elForm.registerLabelWidth(val, oldVal)
        elFormItem.updateComputedLabelWidth(val)
      }
    })

    onMounted(() => {
      updateLabelWidth('update')
    })
    onUpdated(() => {
      updateLabelWidth('update')
    })
    onBeforeUnmount(() => {
      updateLabelWidth('update')
    })

    if (!slots) return null
    if (props.isAutoWidth) {
      const autoLabelWidth = elForm.autoLabelWidth
      const style = {}
      if (autoLabelWidth && autoLabelWidth !== 'auto') {
        const marginLeft = parseInt(autoLabelWidth, 10) - computedWidth.value
        if (marginLeft) {
          style.marginLeft = marginLeft + 'px'
        }
      }
      debugger
      // return (<div class="el-form-item__label-wrap" style={style}>{ slots }</div>)
      return () => h('div', {
          class: 'el-form-item__label-wrap',
          style
        },
        slots
      )
    } else {
      return () => slots[0]
    }
  },

  methods: {
    /*getLabelWidth() {
      if (this.$el && this.$el.firstElementChild) {
        const computedWidth = window.getComputedStyle(this.$el.firstElementChild).width;
        return Math.ceil(parseFloat(computedWidth));
      } else {
        return 0;
      }
    },
    updateLabelWidth(action = 'update') {
      if (this.$slots.default && this.isAutoWidth && this.$el.firstElementChild) {
        if (action === 'update') {
          this.computedWidth = this.getLabelWidth();
        } else if (action === 'remove') {
          this.elForm.deregisterLabelWidth(this.computedWidth);
        }
      }
    }*/
  },

  /*watch: {
    computedWidth (val, oldVal) {
      if (this.updateAll) {
        this.elForm.registerLabelWidth(val, oldVal)
        this.elFormItem.updateComputedLabelWidth(val)
      }
    }
  },*/

  /*data() {
    return {
      computedWidth: 0
    };
  },*/

  /*mounted () {
    this.updateLabelWidth('update')
  },*/

  /*updated () {
    this.updateLabelWidth('update')
  },

  beforeDestroy () {
    this.updateLabelWidth('remove')
  }*/
}
</script>
