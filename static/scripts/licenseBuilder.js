import { initializeLicenseModuleTag } from './LicenseModule.js'
import { initializeLicenseModuleListTag } from './LicenseModuleList.js'

const main = () => {
  console.log('Loading main')
  initializeLicenseModuleTag()
  initializeLicenseModuleListTag()
}

document.addEventListener('DOMContentLoaded', main)
