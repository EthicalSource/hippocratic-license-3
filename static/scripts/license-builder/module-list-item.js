import {
  buildHTML,
  cr,
  isModuleActive,
  createModuleLink,
} from './license-builder.helpers.mjs'

const template = document.createElement('template')

const html = (str) => str

// Triggers prettier formatting
template.innerHTML = html`
  <style>
    li {
      display: flex;
      margin-bottom: 1rem;
      gap: 1rem;
      align-items: center;
    }
    li label {
      flex-grow: 1;
    }
    .module-link {
      flex-grow: 1;
    }
  </style>
`

/**
 * Purpose: This web component renders the available options
 * for each module.
 */
export class ModuleListItem extends HTMLElement {
  constructor() {
    super()

    this.root = this.attachShadow({ mode: 'open' })
    this.root.appendChild(template.content.cloneNode(true))
    const listItem = cr('li')
    this.checkbox = cr('input')
    this.checkbox.type = 'checkbox'
    this.checkboxLabel = cr('label')
    this.findButton = cr('button')
    this.infoButton = cr('button')

    listItem.appendChild(this.checkbox)
    listItem.appendChild(this.checkboxLabel)
    listItem.appendChild(this.findButton)
    listItem.appendChild(this.infoButton)
    this.root.appendChild(listItem)

    // Bind this.
    this.render = this.render.bind(this)
    this.checkboxHandler = this.checkboxHandler.bind(this)
    this.findButtonHandler = this.findButtonHandler.bind(this)
  }

  static get observedAttributes() {
    return ['mod-id']
  }

  attributeChangedCallback() {
    this.render()
  }

  render() {
    // Build listItem
    // Checkbox + label
    const modId = this.getAttribute('mod-id')
    const module = document.querySelector(`license-module[mod-id="${modId}"]`)
    if (!module) {
      alert(`ModuleTooltip could not find mod-id ${modId}`)
      return
    }
    const title = module.getAttribute('title')
    const helpText = module.getAttribute('help-text')
    this.checkbox.id = `input-${modId}`

    this.checkbox.checked = isModuleActive({ id: modId })
    this.checkboxLabel.setAttribute('for', `input-${modId}`)
    this.checkboxLabel.innerText = title
    this.infoButton.innerHTML = `Info`
    this.findButton.innerHTML = `Find`
  }

  checkboxHandler(e) {
    const isChecked = e.target.checked
    const id = this.getAttribute('mod-id')
    const destination = isChecked
      ? createModuleLink({ addModule: id })
      : createModuleLink({ removeModule: id })
    history.replaceState(null, '', destination)
    this.render()
  }

  /**
   * Scrolls the relevant module into view, and
   * makes it visible if it's not visible already.
   */
  findButtonHandler(e) {
    const id = this.getAttribute('mod-id')
    if (isModuleActive({ id })) {
      location.hash = id
    } else {
      const linkWithModules = createModuleLink({ addModule: id })
      history.replaceState(null, '', `${linkWithModules}#${id}`)
      this.render()
    }
    const targetNode = document.querySelector(`#${id}`)
    if (targetNode) {
      targetNode.scrollIntoView()
    }
  }

  connectedCallback() {
    window.addEventListener('locationchange', this.render)
    this.checkbox.addEventListener('click', this.checkboxHandler)
    this.findButton.addEventListener('click', this.findButtonHandler)
  }

  disconnectedCallback() {
    window.removeEventListener('locationchange', this.render)
    this.checkbox.removeEventListener('click', this.checkboxHandler)
    this.findButton.removeEventListener('click', this.findButtonHandler)
  }
}
