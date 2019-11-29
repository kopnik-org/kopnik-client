// Import the mount() method from the test utils
// and the component you want to test
// import { mount } from '@vue/test-utils'
// import Counter from './counter'
// import Vue from "vue/dist/vue.js"

import scalar from 'src/models/decorators/scalar'


describe('scalar', () => {
  class Lazy{
    @scalar name

    constructor(){
      this.id=undefined
    }
  }

  it('должен вызывать GET первый раз', async () => {
    let obj = new Lazy()

    let name= obj.name
    expect(name).toBe(Date)
  })
})