import { LicenseModule } from './LicenseModule.js'
import { LicenseModuleList } from './LicenseModuleList.js'
import { enableLocationChangeEvent } from './locationchangePolyfill.js'

const webComponents = {
  'license-module-list': LicenseModuleList,
  'license-module': LicenseModule,
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
  console.log('Loading main')
  enableLocationChangeEvent()
  loadWebComponents()
}

document.addEventListener('DOMContentLoaded', main)
