import { isModuleActive, cr } from './licenseBuilder.helpers.js'

const isLocalhost = window.location.hostname === 'localhost'

const removeModuleLink = (id) => {
  return `#`
}

const addModuleLink = (id) => {
  return `#${id}`
}

class LicenseModuleList extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    this.list = cr('ul')
    this.root.appendChild(this.list)
  }

  renderModuleOptions() {
    const modules = Array.from(document.querySelectorAll('license-module')).map(
      (node) => {
        return {
          id: node.getAttribute('mod-id'),
          title: node.getAttribute('title'),
        }
      }
    )
    const list = cr('ul')
    modules.forEach((m) => {
      const li = cr('li')
      const a = cr('a')
      if (isModuleActive(m.id)) {
        a.innerHTML = `Remove ${m.title}`
        a.href = `${removeModuleLink(m.id)}`
      } else {
        a.innerHTML = `Add ${m.title}`
        a.href = `${addModuleLink(m.id)}`
      }
      li.appendChild(a)
      list.appendChild(li)
    })
    this.list.replaceWith(list)
    this.list = list
  }

  connectedCallback() {
    this.renderModuleOptions()
  }
}

export const initializeLicenseModuleListTag = () => {
  console.log('initializeLicenseModuleList()')
  const tagName = 'license-module-list'
  const isDefined = customElements.get(tagName)
  if (!isDefined) {
    customElements.define(tagName, LicenseModuleList)
  }
}
