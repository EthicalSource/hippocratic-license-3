const { builder } = require('@netlify/functions')
const { licenseHTML } = require('./hl-full.json')
const { convert } = require('html-to-text')
const { NodeHtmlMarkdown } = require('node-html-markdown')
const cheerio = require('cheerio')

async function downloadLicenseHandler(event, context) {
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
  const { isFull, isCore, activeModules } = parseActiveModules(urlPath)
  const $ = cheerio.load(licenseHTML)
  const licenseSelector = '[data-license-text=true]'
  if (isFull) {
    return $(licenseSelector).html()
  } else if (isCore) {
    // Remove all module sections
    $('license-module').remove()
    return $(licenseSelector).html()
  }
  $('license-module').each(function (index, elem) {
    if (!activeModules.includes($(this).attr('mod-id'))) {
      $(this).remove()
    }
  })
  return $(licenseSelector).html()
}

function getAvailableModules() {
  const $ = cheerio.load(licenseHTML)
  const modules = []
  $('license-module').each(function (index, elem) {
    modules.push($(this).attr('mod-id').toLocaleLowerCase())
  })
  return modules
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

function parseActiveModules(urlPath) {
  // Just the license configuration url part, 'core',
  // 'full', 'bsd-ecoside' etc.
  const licenseUrlPath = urlPath
    .replace(/\/version\/3\/0\/?/gi, '')
    .replace('.md', '')
    .replace('.txt', '')
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

module.exports = {
  // Handler property is used by Netlify
  handler: builder(downloadLicenseHandler),
  // Exporting functions to be tested
  downloadLicenseHandler,
  parseActiveModules,
}
