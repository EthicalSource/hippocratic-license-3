import {
  isModuleActive,
  createModuleLink,
  cr,
} from './license-builder.helpers.mjs'

const template = document.createElement('template')

const html = (str) => str

// Triggers prettier formatting
template.innerHTML = html`
  <style>
    img {
      margin-bottom: -3px;
    }
  </style>
`

/**
 * Purpose: This custom element is a button
 * that toggles whether or not a module should
 * be active. It does so by updating the URL.
 */
export class ModuleToggler extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    this.btn = cr('button')
    this.root.appendChild(template.content.cloneNode(true))
    this.root.appendChild(this.btn)
    this.render = this.render.bind(this)
    this.buttonOnClick = this.buttonOnClick.bind(this)
  }

  static get observedAttributes() {
    return ['mod-id']
  }

  attributeChangedCallback() {
    this.render()
  }

  render() {
    const id = this.getAttribute('mod-id')
    this.btn.setAttribute('data-module-target', id)
    this.btn.classList.add('module-toggler')
    const svgIcon = isModuleActive({ id })
      ? '<img width="20" src="/icons/check-circle.svg" />'
      : `<img width="20" src="/icons/plus-circle.svg" />`
    this.btn.innerHTML = svgIcon
  }

  buttonOnClick(e) {
    const id = this.getAttribute('mod-id')
    const destination = isModuleActive({ id })
      ? createModuleLink({ removeModule: id })
      : createModuleLink({ addModule: id })
    history.replaceState(null, '', destination)
    this.render()
  }

  connectedCallback() {
    window.addEventListener('locationchange', this.render)
    this.btn.addEventListener('click', this.buttonOnClick)
  }

  disconnectedCallback() {
    window.removeEventListener('locationchange', this.render)
    this.btn.removeEventListener('click', this.buttonOnClick)
  }
}
