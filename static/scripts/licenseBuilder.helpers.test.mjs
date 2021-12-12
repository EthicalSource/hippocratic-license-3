import test from 'ava'
import {
  isModuleActive,
  getActiveModules,
  createModuleLink,
} from './licenseBuilder.helpers.mjs'

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
