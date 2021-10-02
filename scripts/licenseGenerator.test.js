import test from 'ava'
import {
  getCombinations,
  loadBaseLicenseHTML,
  findAvailableModules,
} from './licenseGenerator.js'

test('combining three modules', (t) => {
  const modules = ['a', 'b', 'c']
  const result = ['a', 'b', 'c', 'a-b', 'a-c', 'b-c', 'a-b-c']
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
