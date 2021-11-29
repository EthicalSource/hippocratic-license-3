const { builder } = require('@netlify/functions')
const { licenseHTML } = require('./hl-full.json')

async function downloadLicenseHandler(event, context) {
  // Redirect if wrong sub-path
  if (event.path.startsWith('/.netlify/functions')) {
    return {
      statusCode: 302,
      headers: {
        Location: '/version/3/0/full',
      },
    }
  }
  // Redirect if uppercase and/or wrong order of modules.

  // Parse url and provide correct modules to activate.

  // Return proper format depending on file extension.

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: licenseHTML,
  }
}

exports.handler = builder(downloadLicenseHandler)
