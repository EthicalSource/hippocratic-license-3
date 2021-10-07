import test from 'ava'
import { isModuleActive, getActiveModules } from './licenseBuilder.helpers.js'

test('on localhost: should be able to detect active module', (t) => {
  const id = 'myan'
  const sourceUrl = 'http://localhost:1313/version/3/0/hl/#myan'
  t.true(isModuleActive({ sourceUrl, id }))
})

test('when deployed: should be able to detect active module', (t) => {
  const id = 'myan'
  const sourceUrl = 'http://example.org/version/3/0/hl-fsl-myan-bsd'
  t.true(isModuleActive({ sourceUrl, id }))
})

test('when deployed should be able to detect inactive module', (t) => {
  const id = 'myan'
  const sourceUrl = 'http://example.org/version/3/0/hl-fsl-bsd'
  t.false(isModuleActive({ sourceUrl, id }))
})

test('on localhost: should be able to detect inactive module', (t) => {
  const id = 'myan'
  const sourceUrl = 'http://localhost:1313/version/3/0/hl#fsl-bsd'
  t.false(isModuleActive({ sourceUrl, id }))
})

test('localhost: find active modules', (t) => {
  const sourceUrl = 'http://localhost:1313/version/3/0/hl#fsl-bsd'
  t.deepEqual(getActiveModules({ sourceUrl }), ['fsl', 'bsd'])
})

test('in-prod: find active modules', (t) => {
  const sourceUrl = 'http://example.org/version/3/0/hl-fsl-bsd'
  t.deepEqual(getActiveModules({ sourceUrl }), ['fsl', 'bsd'])
})
