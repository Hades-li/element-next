import { describe, it } from 'mocha'
import { mount } from '@vue/test-utils/dist/vue-test-utils.cjs'
import { expect } from 'chai'
import Button from 'packages/button'

describe('A spec suite', function () {
  it('Button', function () {
    const wrapper = mount(Button)
    expect(wrapper.html()).to.include('button')
  })
})
