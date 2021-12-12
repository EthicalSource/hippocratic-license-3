import { getActiveModules, cr } from './licenseBuilder.helpers.js'

/**
 * Purpose: Dynamically create a link to the configured
 * license version according to the specified type.
 */
export class LicenseLink extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    const slot = cr('slot')
    this.link = cr('a')
    this.link.appendChild(slot)
    this.root.appendChild(this.link)
    this.render = this.render.bind(this)
  }

  static get observedAttributes() {
    return ['type']
  }

  attributeChangedCallback() {
    this.render()
  }

  render() {
    const fileEnding = getFileEnding(this.getAttribute('type'))
    const modules = getActiveModules()
    // Assume it's core license
    if (modules.length === 0) {
      this.link.href = `/version/3/0/core${fileEnding}`
    } else {
      this.link.href = `/version/3/0/${modules
        .join('-')
        .toLowerCase()}${fileEnding}`
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

function getFileEnding(fileType) {
  switch (fileType) {
    case 'plaintext':
      return '.txt'
    case 'markdown':
      return '.md'
    case 'html':
      return '.html'
    default:
      throw new Error(`Unknown file type ${fileType}`)
  }
}
