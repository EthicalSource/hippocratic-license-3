import { initializeLicenseModuleTag } from './LicenseModule.js'
import { initializeLicenseModuleListTag } from './LicenseModuleList.js'
import { enableLocationChangeEvent } from './locationchangePolyfill.js'

const main = () => {
  console.log('Loading main')
  enableLocationChangeEvent()
  initializeLicenseModuleTag()
  initializeLicenseModuleListTag()
}

document.addEventListener('DOMContentLoaded', main)
