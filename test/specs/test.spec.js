import { mount } from '@vue/test-utils/dist/vue-test-utils.cjs'
import Test from 'packages/test/src/test'
import Vue from 'vue'

describe('Test', () => {
  it('create', () => {
    const wrapper = mount(Test, {
      slots: {
        default: 'hello'
      }
    })
    // console.log(wrapper.html())
    // expect(wrapper.html()).to.include('div')
  })
})
