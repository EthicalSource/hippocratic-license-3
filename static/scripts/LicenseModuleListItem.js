import {
  isModuleActive,
  createModuleLink,
  cr,
} from './licenseBuilder.helpers.mjs'

/**
 * Purpose: This web component searches for all modules on the
 * page and builds a list of active/inactive modules determined
 * by the last part of the url.
 *
 * Available params:
 * type can be set to: 'active', 'inactive'. If not set it
 * will simply list all modules found on the page.
 */
export class LicenseModuleList extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    this.list = cr('ul')
    this.root.appendChild(this.list)
    this.render()
    this.render = this.render.bind(this)
  }

  static get observedAttributes() {
    return ['type']
  }

  render() {
    // Should we show active, inactive or all modules.
    const listType = this.getAttribute('type') || 'all'
    const modules = Array.from(document.querySelectorAll('license-module'))
      .map((node) => {
        return {
          id: node.getAttribute('mod-id'),
          title: node.getAttribute('title'),
        }
      })
      .filter((m) => {
        return (
          listType === 'all' ||
          (listType === 'active' && isModuleActive(m)) ||
          (listType === 'inactive' && !isModuleActive(m))
        )
      })
    const list = cr('ul')
    modules.forEach((m) => {
      const li = cr('li')
      li.appendChild(buildLink(m))
      list.appendChild(li)
    })
    this.list.replaceWith(list)
    this.list = list
  }

  attributeChangedCallback() {
    this.render()
  }

  connectedCallback() {
    window.addEventListener('locationchange', this.render)
  }

  disconnectedCallback() {
    window.removeEventListener('locationchange', this.render)
  }
}

function buildLink({ id, title }) {
  const a = cr('a')
  // Activate / deactivate modules without page refresh.
  a.onclick = (e) => {
    e.preventDefault()
    history.replaceState(null, '', e.target.href)
  }
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
