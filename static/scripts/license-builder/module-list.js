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
      display: flex;
      margin-bottom: 1rem;
      gap: 1rem;
      align-items: center;
    }
    .module-link {
      flex-grow: 1;
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
      const listItem = buildHTML(`<li>
        <div clas="module-toggler">
          <module-toggler mod-id="${m.id}"></module-toggler>
        </div>
        <div class="module-link">
          <module-show-onclick mod-id="${m.id}">
            <a href="#${m.id}">${m.title}</a>
          </module-show-onclick>
        </div>
        <div class="module-tooltip">
          <module-tooltip mod-id-"${m.id}"></module-tooltip>
        </div>
      </li> `)
      list.appendChild(listItem)
    })
    this.list.replaceWith(list)
    this.list = list
  }
}
