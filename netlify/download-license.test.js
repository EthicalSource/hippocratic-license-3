const test = require('ava')
const {
  downloadLicenseHandler,
  parseActiveModules,
} = require('./functions/download-license.js')

test('we are able to parse active modules from url', async (t) => {
  const exampleUrlPath = '/version/3/0/bds-ecoside'
  const { activeModules } = parseActiveModules(exampleUrlPath)
  t.deepEqual(activeModules, ['bds', 'ecoside'])
})

test('wrong module id order gets sorted', async (t) => {
  const exampleUrlPath = '/version/3/0/ecoside-bds'
  const { activeModules } = parseActiveModules(exampleUrlPath)
  t.deepEqual(activeModules, ['bds', 'ecoside'])
})

test('using core or full cancels other module IDs', async (t) => {
  t.deepEqual(parseActiveModules('/version/3/0/core-bds').activeModules, [
    'core',
  ])
  t.deepEqual(parseActiveModules('/version/3/0/full-bds').activeModules, [
    'full',
  ])
})

test('unknown module id throws 404 error', async (t) => {
  const result = await downloadLicenseHandler({ path: '/version/3/0/abcd-efg' })
  t.is(result.statusCode, 404)
})

test('can handle markdown requests', async (t) => {
  const result = await downloadLicenseHandler({ path: '/version/3/0/core.md' })
  t.is(result.headers['Content-Type'], 'text/markdown')
})

test('can handle plaintext requests', async (t) => {
  const result = await downloadLicenseHandler({ path: '/version/3/0/core.txt' })
  t.is(result.headers['Content-Type'], 'text/plain')
})

test('can handle html requests', async (t) => {
  const result = await downloadLicenseHandler({
    path: '/version/3/0/bds-eco',
  })
  t.is(result.headers['Content-Type'], 'text/html')
})
