import { isModuleActive, cr } from './licenseBuilder.helpers.mjs'

/**
 * Purpose: This web component lets us define clauses within
 * the HL license text that are modules.
 *
 * Example:
 * <license-module mod-id="fsl" title="Fossil">
 *  <li>The actual license clause</li>
 * </license-module>
 *
 * This component checks the url for changes
 * and figures out whether or not it should
 * display its module contents.
 */
export class LicenseModule extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    const slot = cr('slot')
    this.root.appendChild(slot)
    this.children[0].style = 'display: none;'
    this.render = this.render.bind(this)
  }

  static get observedAttributes() {
    return ['mod-id', 'title']
  }

  render() {
    const id = this.getAttribute('mod-id')
    if (isModuleActive({ id })) {
      this.children[0].style = 'display: block;'
      return
    }
    this.children[0].style = 'display: none;'
  }

  connectedCallback() {
    window.addEventListener('locationchange', this.render)
    this.render()
  }

  disconnectedCallback() {
    window.removeEventListener('locationchange', this.render)
  }
}
