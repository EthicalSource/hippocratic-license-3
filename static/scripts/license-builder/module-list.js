import { buildHTML, cr } from './license-builder.helpers.mjs'

const template = document.createElement('template')

const html = (str) => str

// Triggers prettier formatting
template.innerHTML = html`
  <style>
    ul {
      margin: 0;
      padding: 0;
    }
    li {
      margin-bottom: 1rem;
      list-style: none;
    }
  </style>
`

/**
 * Purpose: This web component searches for all modules on the
 * page and builds a list of available modules.
 */
export class ModuleList extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    this.list = cr('ul')
    this.root.appendChild(template.content.cloneNode(true))
    this.root.appendChild(this.list)
    this.render()
    this.render = this.render.bind(this)
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
      const listItem = buildHTML(`
        <li>
          <module-list-item mod-id="${m.id}"></module-list-item>
        </li>
      `)
      list.appendChild(listItem)
    })

    const lastListItem = cr('li')
    if (!this.addAllModulesButton) {
      this.addAllModulesButton = cr('button')
      this.addAllModulesButton.innerHTML = 'Add all modules'
      this.addAllModulesButton.addEventListener('click', this.addAllModules)
    }
    lastListItem.appendChild(this.addAllModulesButton)
    if (!this.resetModulesButton) {
      this.resetModulesButton = cr('button')
      this.resetModulesButton.innerHTML = 'Reset'
      this.resetModulesButton.addEventListener('click', this.resetModules)
    }
    lastListItem.appendChild(this.resetModulesButton)
    list.appendChild(lastListItem)

    this.list.replaceWith(list)
    this.list = list
  }

  resetModules() {
    history.replaceState(null, '', '/build')
  }

  addAllModules() {
    history.replaceState(null, '', `/build?modules=full`)
  }
}
