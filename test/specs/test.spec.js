import { mount } from '@vue/test-utils/dist/vue-test-utils.cjs'
import Test from 'packages/test'

describe('Test', () => {
  it('create', () => {
    const wrapper = mount(Test)
    expect(wrapper.html()).to.be.include('div')
  })
})
