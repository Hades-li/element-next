import { mount } from '@vue/test-utils'
import Tag from 'packages/tag'

describe('Tag', () => {
  it('create', () => {
    const wrapper = mount(Tag, {
      slots: {
        default: 'hello'
      }
    })
    expect(wrapper.html()).toContain('span')
  })
})
