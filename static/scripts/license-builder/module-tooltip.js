import { cr } from './license-builder.helpers.mjs'

/**
 * Purpose: This custom element is a button
 * that toggles whether or not a module should
 * be active. It does so by updating the URL.
 */
export class ModuleTooltip extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    this.btn = cr('button')
    this.root.appendChild(this.btn)
    this.open = false
    this.render = this.render.bind(this)
    this.buttonOnClick = this.buttonOnClick.bind(this)
    this.updateHelpText = this.updateHelpText.bind(this)
  }

  static get observedAttributes() {
    return ['mod-id']
  }

  updateHelpText() {
    const modId = this.getAttribute('mod-id')
    const module = document.querySelector(`license-module[mod-id="${modId}"]`)
    if (!module) {
      alert(`ModuleTooltip could not find mod-id ${modId}`)
      return
    }
    this.helpText = module.getAttribute('help-text')
  }

  attributeChangedCallback() {
    this.open = false
    this.updateHelpText()
    this.render()
  }

  render() {
    this.btn.innerHTML = this.open ? 'Close' : 'Info'
  }

  buttonOnClick(e) {
    this.open = !this.open
    this.render()
  }

  connectedCallback() {
    window.addEventListener('locationchange', this.render)
    this.btn.addEventListener('click', this.buttonOnClick)
    this.render()
  }

  disconnectedCallback() {
    window.removeEventListener('locationchange', this.render)
    this.btn.removeEventListener('click', this.buttonOnClick)
  }
}
