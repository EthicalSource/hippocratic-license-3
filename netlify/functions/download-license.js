const { builder } = require('@netlify/functions')
const { licenseHTML } = require('./hl-full.json')

async function downloadLicenseHandler(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: licenseHTML,
  }
}

exports.handler = builder(downloadLicenseHandler)
