import {
  isModuleActive,
  createModuleLink,
  cr,
} from './licenseBuilder.helpers.js'

const buildLink = ({ id, title }) => {
  const a = cr('a')
  if (isModuleActive({ id })) {
    a.innerHTML = `Remove ${title}`
    const link = createModuleLink({ removeModule: id })
    a.href = link
    return a
  }
  a.innerHTML = `Add ${title}`
  const link = createModuleLink({ addModule: id })
  a.href = link
  return a
}

class LicenseModuleList extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    this.list = cr('ul')
    this.root.appendChild(this.list)
    this.renderModuleOptions()
    this.onUrlChange = this.onUrlChange.bind(this)
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
      li.appendChild(buildLink(m))
      list.appendChild(li)
    })
    this.list.replaceWith(list)
    this.list = list
  }

  onUrlChange() {
    this.renderModuleOptions()
  }

  connectedCallback() {
    window.addEventListener('locationchange', this.onUrlChange)
  }

  disconnectedCallback() {
    window.removeEventListener('locationchange', this.onUrlChange)
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
