import { buildHTML, cr } from './license-builder.helpers.mjs'

const template = document.createElement('template')

// Helper that does nothing, just triggers Prettier formatting
const html = (str) => str

template.innerHTML = html`<style>
  details {
  }
  summary {
    padding: 2rem;
    border-bottom: 3px solid var(--color-orange);
  }
  .content {
    height: 60vh;
    overflow-y: scroll;
  }
</style> `

export class StickyMobileHeader extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    this.root.appendChild(template.content.cloneNode(true))
    const html = buildHTML(`
      <details>
        <summary>License menu</summary>
        <div class="content">
          <slot></slot>
        </div>
      </details>
    `)
    this.root.appendChild(html)
    this.summary = this.root.querySelector('summary')
    this.details = this.root.querySelector('details')
    this.findingLicenseHandler = this.findingLicenseHandler.bind(this)
  }

  findingLicenseHandler(e) {
    this.details.open = false
  }

  connectedCallback() {
    document.addEventListener(
      'finding-license-module',
      this.findingLicenseHandler
    )
  }

  disconnectedCallback() {
    document.removeEventListener(
      'finding-license-module',
      this.findingLicenseHandler
    )
  }
}
