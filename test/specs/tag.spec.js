import { mount } from '@vue/test-utils/dist/vue-test-utils.cjs'
import Tag from 'packages/tag'

describe('Tag', () => {
  it('create', () => {
    const wrapper = mount(Tag, {
      slots: {
        default: 'hello'
      }
    })
    expect(wrapper.html()).to.be.include('span')
  })
})
