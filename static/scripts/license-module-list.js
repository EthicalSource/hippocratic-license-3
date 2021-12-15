import {
  isModuleActive,
  createModuleLink,
  cr,
} from './license-builder.helpers.mjs'

const template = document.createElement('template')

template.innerHTML = `
  <style>
    ul {
      margin: 0;
      padding: 0;
    }
    .list-item {
      display: flex;
    }
  </style>
`

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
    this.root.appendChild(template.content.cloneNode(true))
    this.root.appendChild(this.list)
    this.render()
    this.render = this.render.bind(this)
    this.initialized = littlefoot.littlefoot()
  }

  render() {
    // Get available modules.
    const modules = Array.from(document.querySelectorAll('license-module')).map(
      (node) => {
        return {
          id: node.getAttribute('mod-id'),
          title: node.getAttribute('title'),
          helpText: node.getAttribute('helpText'),
        }
      }
    )
    const list = cr('ul')
    modules.forEach((m) => {
      const li = cr('li')
      li.classList.add('list-item')
      li.appendChild(buildModuleButton(m))
      const p = cr('p')
      p.textContent = m.title
      li.appendChild(p)

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

function buildModuleButton({ id }) {
  const btn = cr('button')
  // Activate / deactivate modules without page refresh.
  btn.setAttribute('data-module-target', id)
  btn.classList.add('license-module__btn')
  btn.innerHTML = isModuleActive({ id }) ? 'Remove' : 'Add'
  btn.onclick = (e) => {
    e.preventDefault()
    const destination = isModuleActive({ id })
      ? createModuleLink({ removeModule: id })
      : createModuleLink({ addModule: id })
    history.replaceState(null, '', destination)
    btn.innerHTML = isModuleActive({ id }) ? 'Remove' : 'Add'
  }
  return btn
}
