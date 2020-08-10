import { mount } from '@vue/test-utils'
import Tag from 'packages/tag'

describe('Tag', () => {
  it('create', () => {
    const wrapper = mount(Tag, {
      slots: {
        default: () => 'tag'
      }
    })
    const el = wrapper.find('.el-tag')
    expect(el.classes()).toContain('el-tag')
    expect(el.classes()).not.toContain('el-tag__close')
    expect(el.classes()).not.toContain('is-hit')
    expect(el.classes()).not.toContain('md-fade-center')
  })
})
