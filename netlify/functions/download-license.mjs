import { JSDOM } from 'jsdom'
import { builder } from '@netlify/functions'
import { licenseHTML } from './hl-full.mjs'
import { convert } from 'html-to-text'
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { incrementAndLinkify } from '../../static/scripts/license-builder/incremented-links.helpers.mjs'

export async function downloadLicenseHandler(event, context) {
  // Disallow going to the .netlify function directly,
  // use the url proxy instead.
  if (event.path.startsWith('/.netlify/functions')) {
    return {
      statusCode: 302,
      headers: {
        Location: '/version/3/0/full',
      },
    }
  }
  const { activeModules, licenseUrlPath, fileTypeEnding } = parseActiveModules(
    event.path
  )
  if (!fileTypeEnding) {
    return {
      statusCode: 404,
    }
  }
  const availableModules = getAvailableModules()
  const unknownModule = activeModules.find(
    (mod) => !['core', 'full'].includes(mod) && !availableModules.includes(mod)
  )
  if (unknownModule) {
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: `Uknown module "${unknownModule}" found in license-url.`,
    }
  }
  // Redirect if License ID is uppercase and/or not proper order
  if (licenseUrlPath !== activeModules.join('-')) {
    return {
      statusCode: 301,
      headers: {
        Location: `/version/3/0/${activeModules.join('-')}${fileTypeEnding}`,
      },
    }
  }
  const { contentType } = getContentType(event.path)
  const configuredLicense = getConfiguredLicenseHTML(event.path)
  return {
    statusCode: 200,
    headers: {
      'Content-Type': `${contentType}; charset=utf-8`,
    },
    body: convertToContentType({ html: configuredLicense, contentType }),
  }
}

function convertToContentType({ html, contentType }) {
  switch (contentType) {
    case 'text/plain':
      return convert(html)
    case 'text/html':
      return html
    case 'text/markdown':
      return NodeHtmlMarkdown.translate(html)
    default:
      throw new Error(`Unknown contentType ${contentType}`)
  }
}

function getConfiguredLicenseHTML(urlPath) {
  const { isFull, isCore, activeModules, fileTypeEnding } =
    parseActiveModules(urlPath)
  const licenseSelector = '[data-license-text=true]'
  const dom = new JSDOM(licenseHTML)
  const modules = dom.window.document.body.querySelectorAll('license-module')
  Array.from(modules).forEach((module) => {
    if (isFull) {
      return // do nothing.
    } else if (isCore) {
      module.remove()
    } else if (!activeModules.includes(module.getAttribute('mod-id'))) {
      module.remove()
    }
  })
  incrementAndLinkify({
    nodes: [dom.window.document.body.querySelector(licenseSelector)],
    window: dom.window,
  })
  return embedLicenseLink({
    license: fileTypeEnding.endsWith('.html')
      ? dom.serialize()
      : dom.window.document.querySelector(licenseSelector).outerHTML,
    activeModules,
    fileTypeEnding,
  })
}

/**
 * embedLicenseLink replaces the text [Hyperlink] with a fitting link
 * based on the active modules and the requested filetype.
 */
function embedLicenseLink({ license, activeModules, fileTypeEnding }) {
  const licenseURL = `https://firstdonoharm.dev/version/3/0/${activeModules.join(
    '-'
  )}${fileTypeEnding}`
  // Special-casing the plaintext version because otherwise the link will
  // look repeated.
  if (fileTypeEnding.endsWith('.txt')) {
    const updatedLicense = license.replace('[Hyperlink]', licenseURL)
    return updatedLicense
  } else {
    const licenseLink = `<a href="${licenseURL}">${licenseURL}</a>`
    const updatedLicense = license.replace('[Hyperlink]', licenseLink)
    return updatedLicense
  }
}

function getAvailableModules() {
  const dom = new JSDOM(licenseHTML)
  const nodes = dom.window.document.body.querySelectorAll('license-module')
  return Array.from(nodes).map((node) =>
    node.getAttribute('mod-id').toLowerCase()
  )
}

function getContentType(urlPath) {
  if (urlPath.endsWith('.txt')) {
    return { contentType: 'text/plain' }
  } else if (urlPath.endsWith('.md')) {
    return {
      contentType: 'text/markdown',
    }
  }
  return { contentType: 'text/html' }
}

export function parseActiveModules(urlPath) {
  // Just the license configuration url part, 'core',
  // 'full', 'bsd-ecoside' etc.
  const licenseUrlPath = urlPath
    .replace(/\/version\/3\/0\/?/gi, '')
    .replace('.md', '')
    .replace('.txt', '')
    .replace('.html', '')
    .toLowerCase()
  const matches = /(\.\w*)$/gi.exec(urlPath)
  const fileTypeEnding = matches ? matches[1] : ''
  const isCore = licenseUrlPath.includes('core')
  const isFull = licenseUrlPath.includes('full')
  const moduleIDs = licenseUrlPath
    .split('-')
    .filter((module) => !['core', 'full'].includes(module))
    .sort()
  return {
    licenseUrlPath,
    isCore,
    isFull,
    activeModules: isCore ? ['core'] : isFull ? ['full'] : moduleIDs,
    fileTypeEnding,
  }
}

// Handler property is used by Netlify
export const handler = builder(downloadLicenseHandler)
