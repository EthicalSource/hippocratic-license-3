const { builder } = require('@netlify/functions')

async function downloadLicenseHandler(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: `
    <!DOCTYPE html>
	    <html>
		    <body>
          <p>Event object:</p>
		      <pre>
            ${JSON.stringify(event, null, 2)}
          </pre>
          <p>Context object:</p>
		      <pre>
            ${JSON.stringify(context, null, 2)}
          </pre>
		    </body>
    </html>
    `,
  }
}

exports.handler = builder(downloadLicenseHandler)
