<template>
  <transition
    name="el-fade-in-top"
    @after-leave="doDestroy"
  >
    <div
      v-show="showPopper"
      class="el-autocomplete-suggestion el-popper"
      :class="{ 'is-loading': !parent.hideLoading && parent.loading }"
      :style="{ width: dropdownWidth }"
      role="region"
      :x-placement="placement"
    >
      <el-scrollbar
        tag="ul"
        wrap-class="el-autocomplete-suggestion__wrap"
        view-class="el-autocomplete-suggestion__list"
      >
        <li v-if="!parent.hideLoading && parent.loading">
          <i class="el-icon-loading" />
        </li>
        <slot v-else />
      </el-scrollbar>
    </div>
  </transition>
</template>
<script>
  import {ref, nextTick, onMounted, onUpdated, mergeProps, getCurrentInstance} from 'vue'
  import {mixinProps, usePopper} from 'src/mixins/vuePopper'
  import {useInput} from "packages/input/src/input";

  const props = mixinProps({
    options: {
      default() {
        return {
          gpuAcceleration: false
        };
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
          })
        } else {
          popper.update()
        }
      }

      function doDestroy() {
        popper.destroy()
      }

      onMounted(() => {
        referenceList = instance.vnode.el.querySelector('.el-autocomplete-suggestion__list');
        referenceList.setAttribute('role', 'listbox');
        referenceList.setAttribute('id', props.id);
      })

      onUpdated(() => {
        // console.log(showPopper.value)
      })

      return {
        showPopper,
        hideLoading: input.hideLoading,
        el: instance.vnode.el,
        parent,
        dropdownWidth,
        placement: popper.placement,
        doDestroy,
        visible,
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
