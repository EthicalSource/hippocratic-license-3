import { LicenseModule } from './license-module.js'
import { LicenseModuleList } from './license-module-list.js'
import { VerifyCustomElements } from './verify-custom-elements.js'
import { enableLocationChangeEvent } from './locationchange-polyfill.js'
import { ConfiguredLicenseLink } from './configured-license-link.js'
import { IncrementedLinks } from './incremented-links.js'
import { ModuleToggler } from './module-toggler.js'

export const webComponents = {
  'module-toggler': ModuleToggler,
  'license-module-list': LicenseModuleList,
  'license-module': LicenseModule,
  'configured-license-link': ConfiguredLicenseLink,
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
