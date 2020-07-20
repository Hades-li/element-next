import { describe, it } from 'mocha'
import { mount } from '@vue/test-utils'
import { expect } from 'chai'
import Button from 'packages/button'

describe('A spec suite', function () {
  it('Button', function () {
    const wrap = mount(Button)
  })
})
