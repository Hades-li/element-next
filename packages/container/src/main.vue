<template>
  <section
    class="el-container"
    :class="{ 'is-vertical': isVertical }"
  >
    <slot />
  </section>
</template>

<script>
  import { computed } from 'vue'

  export default {
    name: 'ElContainer',

    componentName: 'ElContainer',

    props: {
      direction: String
    },

    setup(props, ctx) {
      const slots = ctx.slots.default()
      const isVertical = computed(() => {
        if (props.direction === 'vertical') {
          return true;
        } else if (props.direction === 'horizontal') {
          return false;
        } else {
          // debugger
          // console.log(slots)
          //debug const slots = ctx.slots.default()

          return slots.length > 0
            ? slots.some(vnode => {
              const name = vnode.type && vnode.type.name;
              return name === 'ElHeader' || name === 'ElFooter';
            })
            : false;
        }
      })

      return {
        isVertical
      }
    },

    /*computed: {
      isVertical() {
        if (this.direction === 'vertical') {
          return true;
        } else if (this.direction === 'horizontal') {
          return false;
        }
        return this.$slots && this.$slots.default
          ? this.$slots.default.some(vnode => {
            const tag = vnode.componentOptions && vnode.componentOptions.tag;
            return tag === 'el-header' || tag === 'el-footer';
          })
          : false;
      }
    }*/
  };
</script>
