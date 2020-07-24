// import { describe, it } from 'mocha'
import { mount } from '@vue/test-utils/dist/vue-test-utils.cjs'
// import { expect } from 'chai'
import Button from 'packages/button'
// const { describe, it} = require('mocha')
// const { mount } = require('@vue/test-utils/dist/vue-test-utils.esm-bundler')
// const expect = require('chai').expect
// const Button = require('packages/button')

describe('A spec suite', function () {
  it('Button', function () {
    const wrapper = mount(Button)
    expect(wrapper.html()).to.be.include('button')
  })
})
