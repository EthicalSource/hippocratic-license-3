import { suite, test } from 'node:test'
import assert from 'node:assert/strict'
import {
  isModuleActive,
  getActiveModules,
  createModuleLink,
  getLicenseString,
  isCoreLicense,
  isFullLicense,
} from '../static/scripts/license-builder/license-builder.helpers.js'

suite('License builder helpers', () => {
  test('should be able to detect active module', () => {
    const id = 'myan'
    assert.equal(
      isModuleActive({
        sourceUrl: 'http://localhost:1313/build/?modules=myan',
        id,
      }),
      true,
      'failed to detect active module'
    )
  })

  test('should be able to detect inactive module', () => {
    const id = 'myan'
    assert.equal(
      isModuleActive({
        sourceUrl: 'http://localhost:1313/build/?modules=fsl,bsd',
        id,
      }),
      false,
      'failed to detect inactive module'
    )
  })

  test('find active modules', () => {
    assert.deepEqual(
      getActiveModules({
        sourceUrl: 'http://localhost:1313/build/?modules=fsl,bsd',
      }),
      ['fsl', 'bsd'],
      'failed to find active modules on localhost'
    )
  })

  test('no active modules should be empty list', () => {
    assert.deepEqual(
      getActiveModules({
        sourceUrl: 'http://localhost:1313/build',
      }),
      [],
      'Failed to establish empty list'
    )
  })

  test('correctly identifies core license with default url', () => {
    assert.equal(
      isCoreLicense({
        sourceUrl: 'http://localhost:1313/build',
      }),
      true
    )
  })

  test('correctly identifies core license with empty query string', () => {
    assert.equal(
      isCoreLicense({
        sourceUrl: 'http://localhost:1313/build/?modules=',
      }),
      true
    )
  })

  test('does not identify selections as core license', () => {
    assert.equal(
      isCoreLicense({
        sourceUrl: 'http://localhost:1313/build/?modules=fsl,bsd',
      }),
      false
    )
  })

  test('does not identify erroneous data as core license', () => {
    assert.equal(
      isCoreLicense({
        sourceUrl: 'http://localhost:1313/build/?modules=true',
      }),
      false
    )
  })

  test('correctly identifies full license', () => {
    assert.equal(
      isFullLicense({
        sourceUrl: 'http://localhost:1313/build/?modules=full',
      }),
      true
    )
  })

  test('does not identify selections as full license', () => {
    assert.equal(
      isFullLicense({
        sourceUrl: 'http://localhost:1313/build/?modules=fsl,bsd',
      }),
      false
    )
  })

  test('does not identify empty query string as full license', () => {
    assert.equal(
      isFullLicense({
        sourceUrl: 'http://localhost:1313/build/?modules=',
      }),
      false
    )
  })

  test('returns correct license string with selections', () => {
    assert.equal(
      getLicenseString({
        sourceUrl: 'http://localhost:1313/build/?modules=fsl,bsd',
      }),
      'fsl-bsd',
      'Failed to return correct license string'
    )
  })

  test('returns correct license string for core license', () => {
    assert.equal(
      getLicenseString({
        sourceUrl: 'http://localhost:1313/build',
      }),
      'core',
      'Failed to return correct license string'
    )
  })

  test('returns correct license string for full license', () => {
    assert.equal(
      getLicenseString({
        sourceUrl: 'http://localhost:1313/build?modules=full',
      }),
      'full',
      'Failed to return correct license string'
    )
  })

  test('creating module links', () => {
    assert.equal(
      createModuleLink({
        sourceUrl: 'http://localhost:1313/build/?modules=fsl',
        addModule: 'bsd',
      }),
      'http://localhost:1313/build/?modules=bsd,fsl'
    )
    assert.equal(
      createModuleLink({
        sourceUrl: 'http://localhost:1313/build/?modules=bsd,fsl',
        removeModule: 'bsd',
      }),
      'http://localhost:1313/build/?modules=fsl'
    )
  })
})
