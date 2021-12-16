import {
  isModuleActive,
  createModuleLink,
  cr,
} from './license-builder.helpers.mjs'

/**
 * Purpose: Ensure that a given module is displayed
 * when the contents of this module is clicked, such
 * as a link or button.
 */
export class ModuleShowOnclick extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    this.root.appendChild(cr('slot'))
    this.onClickHandler = this.onClickHandler.bind(this)
  }

  static get observedAttributes() {
    return ['mod-id']
  }

  onClickHandler(e) {
    const id = this.getAttribute('mod-id')
    if (isModuleActive({ id })) {
      return // do nothing
    }
    const destination = createModuleLink({ addModule: id })
    history.replaceState(null, '', destination)
  }

  connectedCallback() {
    window.addEventListener('locationchange', this.render)
    this.root.addEventListener('click', this.onClickHandler)
  }

  disconnectedCallback() {
    window.removeEventListener('locationchange', this.render)
    this.root.removeEventListener('click', this.onClickHandler)
  }
}
