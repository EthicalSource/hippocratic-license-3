import fs from 'fs/promises'
import path from 'path'
import { URL } from 'url'

/**
 * Purpose: The `download-license` handler needs to have
 * access to the full license text built by Hugo in order
 * to provide plaintext and markdown versions.
 *
 * During deploy Netlify functions including their dependencies
 * get zipped up and deployed. Learn more about the underlying
 * module that handles this process: https://github.com/netlify/zip-it-and-ship-it
 */
const prepareLambdas = async () => {
  // __dirname trick sourced from: https://stackoverflow.com/a/66651120
  const __dirname = new URL('.', import.meta.url).pathname
  const src = path.resolve(
    __dirname,
    'public/_build-dependency-hl-3.0/full/index.html'
  )
  const dest = path.resolve(__dirname, 'netlify/functions/hl-full.mjs')
  const data = await fs.readFile(src, { encoding: 'utf-8' })
  if (!data) {
    throw new Error('No source text found')
  }
  await fs.writeFile(
    dest,
    `export const licenseHTML = ${JSON.stringify(data, null, 2)} `
  )
  console.log('Done with work')
}
prepareLambdas().catch((err) =>
  console.error('Failed to prepare Lambda dependencies. Error was', err)
)
