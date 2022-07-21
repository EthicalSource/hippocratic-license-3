import test from 'ava'
import {
  isModuleActive,
  getActiveModules,
  createModuleLink,
  getLicenseString,
  isCoreLicense,
  isFullLicense,
} from '../static/scripts/license-builder/license-builder.helpers.js'

test('should be able to detect active module', (t) => {
  const id = 'myan'
  t.true(
    isModuleActive({
      sourceUrl: 'http://localhost:1313/build/?modules=myan',
      id,
    }),
    'failed to detect active module'
  )
})

test('should be able to detect inactive module', (t) => {
  const id = 'myan'
  t.false(
    isModuleActive({
      sourceUrl: 'http://localhost:1313/build/?modules=fsl,bsd',
      id,
    }),
    'failed to detect inactive module'
  )
})

test('find active modules', (t) => {
  t.deepEqual(
    getActiveModules({
      sourceUrl: 'http://localhost:1313/build/?modules=fsl,bsd',
    }),
    ['fsl', 'bsd'],
    'failed to find active modules on localhost'
  )
})

test('no active modules should be empty list', (t) => {
  t.deepEqual(
    getActiveModules({
      sourceUrl: 'http://localhost:1313/build',
    }),
    [],
    'Failed to establish empty list'
  )
})

test('correctly identifies core license with default url', (t) => {
  t.true(
    isCoreLicense({
      sourceUrl: 'http://localhost:1313/build',
    })
  )
})

test('correctly identifies core license with empty query string', (t) => {
  t.true(
    isCoreLicense({
      sourceUrl: 'http://localhost:1313/build/?modules=',
    })
  )
})

test('does not identify selections as core license', (t) => {
  t.false(
    isCoreLicense({
      sourceUrl: 'http://localhost:1313/build/?modules=fsl,bsd',
    })
  )
})

test('does not identify erroneous data as core license', (t) => {
  t.false(
    isCoreLicense({
      sourceUrl: 'http://localhost:1313/build/?modules=true',
    })
  )
})

test('correctly identifies full license', (t) => {
  t.true(
    isFullLicense({
      sourceUrl: 'http://localhost:1313/build/?modules=full',
    })
  )
})

test('does not identify selections as full license', (t) => {
  t.false(
    isFullLicense({
      sourceUrl: 'http://localhost:1313/build/?modules=fsl,bsd',
    })
  )
})

test('does not identify empty query string as full license', (t) => {
  t.false(
    isFullLicense({
      sourceUrl: 'http://localhost:1313/build/?modules=',
    })
  )
})

test('returns correct license string with selections', (t) => {
  t.is(
    getLicenseString({
      sourceUrl: 'http://localhost:1313/build/?modules=fsl,bsd',
    }),
    'fsl-bsd',
    'Failed to return correct license string'
  )
})

test('returns correct license string for core license', (t) => {
  t.is(
    getLicenseString({
      sourceUrl: 'http://localhost:1313/build',
    }),
    'core',
    'Failed to return correct license string'
  )
})

test('returns correct license string for full license', (t) => {
  t.is(
    getLicenseString({
      sourceUrl: 'http://localhost:1313/build?modules=full',
    }),
    'full',
    'Failed to return correct license string'
  )
})

test('creating module links', (t) => {
  t.is(
    createModuleLink({
      sourceUrl: 'http://localhost:1313/build/?modules=fsl',
      addModule: 'bsd',
    }),
    'http://localhost:1313/build/?modules=bsd,fsl'
  )
  t.is(
    createModuleLink({
      sourceUrl: 'http://localhost:1313/build/?modules=bsd,fsl',
      removeModule: 'bsd',
    }),
    'http://localhost:1313/build/?modules=fsl'
  )
})
