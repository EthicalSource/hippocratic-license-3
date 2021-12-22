import { buildHTML, cr, getAllModules } from './license-builder.helpers.mjs'

const template = document.createElement('template')

const html = (str) => str

// Triggers prettier formatting
template.innerHTML = html`
  <style>
    ul {
      margin: 0;
      padding: 0;
      display: grid;
      grid-auto-rows: 1fr;
    }
    li {
      margin-bottom: 1rem;
      list-style: none;
    }
    .reset-or-add-all-modules {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
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
    const modules = getAllModules()
    const list = cr('ul')
    modules.forEach((m) => {
      const listItem = buildHTML(`
        <li>
          <module-list-item mod-id="${m.id}"></module-list-item>
        </li>
      `)
      list.appendChild(listItem)
    })
    // Finally add buttons for activating / deactivating all options.
    const lastListItem = cr('li')
    lastListItem.classList.add('reset-or-add-all-modules')
    if (!this.resetModulesButton) {
      this.resetModulesButton = cr('button')
      this.resetModulesButton.innerHTML = 'Deactivate all modules'
      this.resetModulesButton.addEventListener('click', this.resetModules)
    }
    lastListItem.appendChild(this.resetModulesButton)
    if (!this.addAllModulesButton) {
      this.addAllModulesButton = cr('button')
      this.addAllModulesButton.innerHTML = 'Activate all modules'
      this.addAllModulesButton.addEventListener('click', this.addAllModules)
    }
    lastListItem.appendChild(this.addAllModulesButton)

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
