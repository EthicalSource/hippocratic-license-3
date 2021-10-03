import test from 'ava'
import {
  getCombinations,
  loadBaseLicenseHTML,
  findAvailableModules,
} from './licenseGenerator.js'

test('combining three modules', (t) => {
  const modules = ['a', 'B', 'c']
  const result = ['A', 'B', 'C', 'A-B', 'A-C', 'B-C', 'A-B-C']
  t.deepEqual(getCombinations(modules), result)
})

test('able to load base license file', async (t) => {
  const text = await loadBaseLicenseHTML()
  t.truthy(text, 'was not able to load text')
})

test('can parse available modules from license text', (t) => {
  const html = `
    <html>
      <body>
        <h1>Example</h1>
        <div data-module-id="123"></div>
        <div data-module-id="abc"></div>
        <div data-module-id="321"></div>
      </body>
    </html>
  `
  const modules = findAvailableModules(html)
  t.deepEqual(modules, ['123', 'abc', '321'], 'was not able to find modules')
})
