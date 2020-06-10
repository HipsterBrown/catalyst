import {findTarget, findTargets} from '../lib/findtarget.js'

class MyController extends HTMLElement {}
if (!window.customElements.get('my-controller')) {
  window.MyController = MyController
  window.customElements.define('my-controller', MyController)
}

describe('findTarget', () => {
  it('calls querySelectorAll with the controller name and target name', () => {
    const instance = new MyController()
    chai.spy.on(instance, 'querySelectorAll', () => [])
    findTarget(instance, 'foo')
    expect(instance.querySelectorAll).to.have.been.called.once.with.exactly('[data-target*="my-controller.foo"]')
  })

  it('returns first element where closest tag is the controller', () => {
    const els = [document.createElement('div'), document.createElement('div')]
    const instance = new MyController()
    chai.spy.on(instance, 'querySelectorAll', () => els)
    chai.spy.on(els[0], 'closest', () => null)
    chai.spy.on(els[1], 'closest', () => instance)
    const target = findTarget(instance, 'foo')
    expect(els[0].closest).to.have.been.called.once.with.exactly('my-controller')
    expect(els[1].closest).to.have.been.called.once.with.exactly('my-controller')
    expect(target).to.equal(els[1])
  })
})

describe('findTargets', () => {
  it('calls querySelectorAll with the controller name and target name', () => {
    const instance = new MyController()
    chai.spy.on(instance, 'querySelectorAll', () => [])
    findTargets(instance, 'foo')
    expect(instance.querySelectorAll).to.have.been.called.once.with.exactly('[data-target*="my-controller.foo"]')
  })

  it('returns all elements where closest tag is the controller', () => {
    const els = [document.createElement('div'), document.createElement('div'), document.createElement('div')]
    const instance = new MyController()
    chai.spy.on(instance, 'querySelectorAll', () => els)
    chai.spy.on(els[0], 'closest', () => instance)
    chai.spy.on(els[1], 'closest', () => null)
    chai.spy.on(els[2], 'closest', () => instance)
    const targets = findTargets(instance, 'foo')
    expect(els[0].closest).to.have.been.called.once.with.exactly('my-controller')
    expect(els[1].closest).to.have.been.called.once.with.exactly('my-controller')
    expect(els[2].closest).to.have.been.called.once.with.exactly('my-controller')
    expect(targets).to.deep.equal([els[0], els[2]])
  })
})
