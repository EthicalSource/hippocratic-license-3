import { LicenseModule } from './license-module.js'
import { VerifyCustomElements } from './verify-custom-elements.js'
import { enableLocationChangeEvent } from './locationchange-polyfill.js'
import { ConfiguredLicenseLink } from './configured-license-link.js'
import { IncrementedLinks } from './incremented-links.js'
import { StickyMobileHeader } from './sticky-mobile-header.js'

export const webComponents = {
  'sticky-mobile-header': StickyMobileHeader,
  'license-module': LicenseModule,
  'configured-license-link': ConfiguredLicenseLink,
  'incremented-links': IncrementedLinks,
  'verify-custom-elements': VerifyCustomElements,
  // Elements loaded from embedded HTML.
  'module-list-item': '',
  'module-list': '',
  'module-button': '',
}

function loadWebComponents() {
  Object.entries(webComponents).forEach(([tagName, component]) => {
    const isDefined = customElements.get(tagName)
    if (isDefined) {
      return // do nothing
    }
    customElements.define(tagName, component)
  })
}

const main = () => {
  enableLocationChangeEvent()
  loadWebComponents()
}

document.addEventListener('DOMContentLoaded', main)
