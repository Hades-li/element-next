<template>
  <transition
    name="el-fade-in-top"
    @after-leave="doDestroy"
  >
    <div
      v-if="showPopper"
      class="el-autocomplete-suggestion el-popper"
      :class="{ 'is-loading': !hideLoading && loading }"
      :style="{ width: dropdownWidth }"
      role="region"
      :x-placement="placement"
    >
      <el-scrollbar
        tag="ul"
        wrap-class="el-autocomplete-suggestion__wrap"
        view-class="el-autocomplete-suggestion__list"
        @scroll="handleScroll"
      >
        <li v-if="!hideLoading && loading">
          <i class="el-icon-loading" />
        </li>
        <slot v-else />
      </el-scrollbar>
    </div>
  </transition>
</template>
<script>
  import {ref, nextTick, getCurrentInstance, watchEffect} from 'vue'
  import {mixinProps, usePopper} from 'src/mixins/vuePopper'
  import {useInput} from "packages/input/src/input"

  const clientHeight = ref(0)
  const scrollTop = ref(0)

  export function useAutoSuggestions() {
    return {
      scrollTop: scrollTop.value,
      clientHeight: clientHeight.value
    }
  }

  const props = mixinProps({
    options: {
      default() {
        return {
          gpuAcceleration: false
        }
      }
    },
    id: String
  })
  export default {

    componentName: 'ElAutocompleteSuggestions',

    /*props: {
      popperOptions: {
        type: Object,
        default() {
          return {
            gpuAcceleration: false
          };
        }
      },
      id: {
        type: String,
        default: '102'
      }
    },*/
    props,
    setup(props) {
      const instance = getCurrentInstance()
      let popper = usePopper(props)
      const input = useInput()
      const dropdownWidth = ref('')
      const showPopper = ref(false)
      const parent = ref(instance.parent)
      let referenceList = undefined

      // methods
      function select(item) {
        // this.dispatch('ElAutocomplete', 'item-click', item);
        // input.itemClick(item)
      }

      function visible(val, inputWidth) {
        dropdownWidth.value = inputWidth + 'px'
        showPopper.value = val
        //  打开
        if (val) {
          nextTick(() => {
            popper.show()
            referenceList = instance.vnode.el?.querySelector('.el-autocomplete-suggestion__list')
            referenceList?.setAttribute('role', 'listbox')
            referenceList?.setAttribute('id', props.id)
            clientHeight.value = instance.vnode.el.querySelector('.el-autocomplete-suggestion__wrap').clientHeight
          })
        } else {
          popper.update()
        }
      }

      function doDestroy() {
        popper.destroy()
      }

      function handleScroll(elScroll) {
        scrollTop.value = elScroll.scrollTop
      }

      return {
        showPopper,
        hideLoading: input.hideLoading,
        loading: input.loading,
        el: instance.vnode.el,
        parent,
        dropdownWidth,
        placement: popper.placement,
        doDestroy,
        visible,
        handleScroll,
      }
    },
    /*data() {
      return {
        parent: this.$parent,
        dropdownWidth: ''
      };
    },*/
    /*methods: {
      select(item) {
        this.dispatch('ElAutocomplete', 'item-click', item);
      }
    },*/

    /*updated() {
      this.$nextTick(_ => {
        this.popperJS && this.updatePopper();
      });
    },*/

    /*mounted() {
      this.$parent.popperElm = this.popperElm = this.$el;
      this.referenceElm = this.$parent.$refs.input.$refs.input || this.$parent.$refs.input.$refs.textarea;
      this.referenceList = this.$el.querySelector('.el-autocomplete-suggestion__list');
      this.referenceList.setAttribute('role', 'listbox');
      this.referenceList.setAttribute('id', this.id);
    },*/

    /*created() {
      this.$on('visible', (val, inputWidth) => {
        this.dropdownWidth = inputWidth + 'px';
        this.showPopper = val;
      });
    }*/
  }
</script>
