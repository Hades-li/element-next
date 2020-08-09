import { mount } from '@vue/test-utils/dist/vue-test-utils.cjs'
import Button from 'packages/button'
import 'src/theme-chalk/src/index.scss'

import {defineComponent,ref} from 'vue'
// const { describe, it} = require('mocha')
// const { mount } = require('@vue/test-utils/dist/vue-test-utils.esm-bundler')
// const expect = require('chai').expect
// const Button = require('packages/button')

describe('Button', function () {
  it('create', function () {
    const wrapper = mount(Button, {
      props: {
        type: 'primary'
      }
    })
    expect(wrapper.find('button').classes()).toContain('el-button--primary')
  })
  it('icon', () => {
    const wrapper = mount(Button, {
      props: {
        icon: 'el-icon-search'
      }
    })
    expect(wrapper.find('.el-icon-search').classes()).toContain('el-icon-search')
  })

  it('nativeType', () => {
    const wrapper = mount(Button, {
      props: {
        nativeType: 'submit'
      }
    })
    expect(wrapper.attributes('type')).toEqual('submit')
  })

  it('loading', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      }
    })
    let buttonElm = wrapper.find('button');
    expect(buttonElm.classes()).toContain('is-loading')
    expect(wrapper.html()).toContain('el-icon-loading')
  })
  it('disabled', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      }
    })
    let buttonElm = wrapper.find('button');
    expect(buttonElm.classes()).toContain('is-disabled')
  })

  it('size', () => {
    const wrapper = mount(Button, {
      props: {
        size: 'medium'
      }
    })
    let buttonElm = wrapper.find('button');
    expect(buttonElm.classes()).toContain('el-button--medium')
  })
  it('plain', () => {
    const wrapper = mount(Button, {
      props: {
        plain: true
      }
    })
    let buttonElm = wrapper.find('button')
    expect(buttonElm.classes()).toContain('is-plain')
  })

  it('round', () => {
    const wrapper = mount(Button, {
      props: {
        round: true
      }
    })
    let buttonElm = wrapper.find('button')
    expect(buttonElm.classes()).toContain('is-round')
  })

  it('circle', () => {
    const wrapper = mount(Button, {
      props: {
        circle: true
      }
    })
    let buttonElm = wrapper.find('button')
    expect(buttonElm.classes()).toContain('is-circle')
  })

  it('click', async () => {
    const wrapper = mount(defineComponent({
      template: `<div id="app">
      <button @click="handleClick">ok</button>
      <button class="loadBtn" :loading="true" @click="handleClick">
        <span class="inner-slot"></span>
      </button>
      <span class="text">count: {{count}}</span>
      </div>`,
      components: {
        Button
      },
      setup() {
        const count = ref(0)
        function handleClick() {
          count.value += 1
        }
        return {
          count,
          handleClick
        }
      },
    }))
    await wrapper.find('button').trigger('click')
    await wrapper.find('.inner-slot').trigger('click')
    expect(wrapper.find('.text').text()).toBe('count: 2')
  })

})
