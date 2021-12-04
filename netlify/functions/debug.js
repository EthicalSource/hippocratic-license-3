import { builder } from '@netlify/functions'

/**
 * Purpose: Expose URL for easily learning what data
 * is available on the event and context objects.
 *
 * Example, visit this sub-url to get a debug page:
 * /.netlify/functions/debug
 *
 * @param {*} event information about the inbound request
 * @param {*} context overall execution context, like logged in user
 * @returns
 */
async function debugHandler(event, context) {
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

export const handler = builder(debugHandler)
