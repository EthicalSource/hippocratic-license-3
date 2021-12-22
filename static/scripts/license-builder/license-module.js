import { isModuleActive, cr } from './license-builder.helpers.mjs'

const template = document.createElement('template')

// Hack for triggering Prettier formatting.
const html = (str) => str

template.innerHTML = html`<style>
  /* Style the wrapped content */
  ::slotted(*) {
    transition: background-color 0.3s ease-in;
  }
  ::slotted(.highlight) {
    background-color: white;
    border: 3px dotted var(--color-orange);
  }
</style> `

/**
 * Purpose: This web component lets us define clauses within
 * the HL license text that are modules.
 *
 * Example:
 * <license-module mod-id="fsl" title="Fossil" help-text="">
 *  <li>The actual license clause</li>
 * </license-module>
 *
 * This component checks the url for changes
 * and figures out whether or not it should
 * display its module contents.
 */
export class LicenseModule extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    const slot = cr('slot')
    slot.appendChild(template.content.cloneNode(true))
    this.root.appendChild(slot)
    this.children[0].style = 'display: none;'
    this.render = this.render.bind(this)
  }

  static get observedAttributes() {
    return ['mod-id', 'title', 'help-text']
  }

  render() {
    const id = this.getAttribute('mod-id')
    if (!isModuleActive({ id })) {
      this.children[0].style = 'display: none;'
    }
    if (isModuleActive({ id })) {
      this.children[0].style = 'display: block;'
    }
    if (location.hash === `#${id}`) {
      this.children[0].classList.add('highlight')
    } else {
      this.children[0].classList.remove('highlight')
    }
  }

  connectedCallback() {
    window.addEventListener('locationchange', this.render)
    this.render()
  }

  disconnectedCallback() {
    window.removeEventListener('locationchange', this.render)
  }
}
