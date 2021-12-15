import { cr } from './license-builder.helpers.mjs'
import { incrementAndLinkify } from './incremented-links.helpers.mjs'

/**
 * Purpose: When adding/removing modules we need to dynamically
 * adjust any numberings found in the license.
 */
export class IncrementedLinks extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    this.root.appendChild(cr('slot'))
    this.render = this.render.bind(this)
    window.addEventListener('DOMContentLoaded', this.render)
  }

  render() {
    incrementAndLinkify({ nodes: this.children })
  }

  connectedCallback() {
    window.addEventListener('locationchange', this.render)
  }

  disconnectedCallback() {
    window.removeEventListener('locationchange', this.render)
  }
}
