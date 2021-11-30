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
  const result = await downloadLicenseHandler({
    path: '/version/3/0/eco-bds.txt',
  })
  t.is(result.headers.Location, '/version/3/0/bds-eco.txt')
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
  t.like(result, {
    statusCode: 200,
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
})

test('can handle plaintext requests', async (t) => {
  const result = await downloadLicenseHandler({
    path: '/version/3/0/core.txt',
  })
  t.like(result, {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
})

test('can handle html requests', async (t) => {
  const result = await downloadLicenseHandler({
    path: '/version/3/0/bds-eco',
  })
  t.like(result, {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
})
