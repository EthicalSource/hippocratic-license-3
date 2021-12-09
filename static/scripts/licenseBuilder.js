import { LicenseModule } from './LicenseModule.js'
import { LicenseModuleList } from './LicenseModuleList.js'
import { VerifyCustomElements } from './VerifyCustomElements.js'
import { enableLocationChangeEvent } from './locationchangePolyfill.js'
import { LicenseLink } from './LicenseLink.js'
import { IncrementedLinks } from './IncrementedLinks.js'

export const webComponents = {
  'license-module-list': LicenseModuleList,
  'license-module': LicenseModule,
  'license-link': LicenseLink,
  'incremented-links': IncrementedLinks,
  'verify-custom-elements': VerifyCustomElements,
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
