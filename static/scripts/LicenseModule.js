import { isModuleActive } from './licenseBuilder.helpers.js'

const template = document.createElement('template')
template.innerHTML = `
    <div>
        <slot></slot>
    </div>
`

class LicenseModule extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    this.root.appendChild(template.content.cloneNode(true))
    this.wrapper = this.root.querySelector('div')
    this.wrapper.style = 'display: none;'
  }

  static get observedAttributes() {
    return ['mod-id', 'title', 'help-text']
  }

  shouldIDisplay() {
    const moduleID = this.getAttribute('mod-id')
    if (isModuleActive(moduleID)) {
      console.log('Displaying module', moduleID)
      this.wrapper.style = 'display: block;'
    }
  }

  connectedCallback() {
    this.shouldIDisplay()
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
