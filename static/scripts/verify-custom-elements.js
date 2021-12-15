import { webComponents } from './license-builder.js'

/**
 * Purpose: Avoid showing content unless specified custom elements
 * have loaded. This is to avoid showing a configured license with
 * the wrong modules showing because the user does not have JavaScript
 * activated.
 *
 * Usage example:
 *
 * <verify-custom-elements>
 *  <noscript>JavaScript needs to be enabled to view the configured license.</noscript>
 *  <div style="display:none;">
 *    <!-- content -->
 *  </div>
 * </verify-custom-elements>
 */
export class VerifyCustomElements extends HTMLElement {
  constructor() {
    super()
    this.checkIfModulesLoaded = this.checkIfModulesLoaded.bind(this)
  }

  checkIfModulesLoaded() {
    const isAllModulesLoaded = Object.keys(webComponents).every((tagName) =>
      customElements.get(tagName)
    )
    if (!isAllModulesLoaded) {
      return // do nothing
    }
    const firstDiv = this.querySelector('div')
    firstDiv.style = ''
    clearInterval(this.intervalID)
    this.intervalID = undefined
  }

  connectedCallback() {
    this.intervalID = setInterval(this.checkIfModulesLoaded, 1000)
    this.checkIfModulesLoaded()
  }

  disconnectedCallback() {
    clearInterval(this.intervalID)
  }
}
