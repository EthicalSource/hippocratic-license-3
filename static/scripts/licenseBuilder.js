import { LicenseModule } from './LicenseModule.js'
import { LicenseModuleList } from './LicenseModuleList.js'
import { VerifyCustomElements } from './VerifyCustomElements.js'
import { enableLocationChangeEvent } from './locationchangePolyfill.js'

export const webComponents = {
  'license-module-list': LicenseModuleList,
  'license-module': LicenseModule,
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
