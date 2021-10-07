import test from 'ava'
import { isModuleActive, getActiveModules } from './licenseBuilder.helpers.js'

test('should be able to detect active module', (t) => {
  const id = 'myan'
  t.true(
    isModuleActive({
      sourceUrl: 'http://localhost:1313/version/3/0/hl/#myan',
      id,
    }),
    'production: failed to detect active module'
  )
  t.true(
    isModuleActive({
      sourceUrl: 'http://example.org/version/3/0/hl-fsl-myan-bsd',
      id,
    }),
    'production: failed to detect active module'
  )
})

test('should be able to detect inactive module', (t) => {
  const id = 'myan'
  t.false(
    isModuleActive({
      sourceUrl: 'http://localhost:1313/version/3/0/hl#fsl-bsd',
      id,
    }),
    'localhost: failed to detect inactive module'
  )
  t.false(
    isModuleActive({
      sourceUrl: 'http://example.org/version/3/0/hl-fsl-bsd',
      id,
    }),
    'production: failed to detect inactive module'
  )
})

test('find active modules', (t) => {
  t.deepEqual(
    getActiveModules({
      sourceUrl: 'http://localhost:1313/version/3/0/hl#fsl-bsd',
    }),
    ['fsl', 'bsd'],
    'failed to find active modules on localhost'
  )
  t.deepEqual(
    getActiveModules({
      sourceUrl: 'http://example.org/version/3/0/hl-fsl-bsd',
    }),
    ['fsl', 'bsd'],
    'failed to find active modules when deployed'
  )
})
