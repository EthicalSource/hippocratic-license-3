import { isModuleActive, cr } from './licenseBuilder.helpers.js'

class LicenseModule extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    const slot = cr('slot')
    this.root.appendChild(slot)
    this.children[0].style = 'display: none;'
    this.onUrlChange = this.onUrlChange.bind(this)
  }

  static get observedAttributes() {
    return ['mod-id', 'title', 'help-text']
  }

  shouldIDisplay() {
    const id = this.getAttribute('mod-id')
    if (isModuleActive({ id })) {
      console.log('Displaying module', id)
      this.children[0].style = 'display: block;'
      return
    }
    console.log('Hiding module', id)
    this.children[0].style = 'display: none;'
  }

  connectedCallback() {
    this.shouldIDisplay()
  }

  onUrlChange() {
    this.shouldIDisplay()
  }

  connectedCallback() {
    window.addEventListener('locationchange', this.onUrlChange)
  }

  disconnectedCallback() {
    window.removeEventListener('locationchange', this.onUrlChange)
  }
}

export const initializeLicenseModuleTag = () => {
  console.log('initializeLicenseModule()')
  const tagName = 'license-module'
  const isDefined = customElements.get(tagName)
  if (!isDefined) {
    customElements.define(tagName, LicenseModule)
  }
}
