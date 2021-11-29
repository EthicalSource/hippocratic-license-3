import fs from 'fs/promises'
import path from 'path'
import { URL } from 'url'

// Sourced from: https://stackoverflow.com/a/66651120
const __dirname = new URL('.', import.meta.url).pathname

const prepareLambdas = async () => {
  const src = path.resolve(__dirname, 'public/version/3/0/full/index.html')
  const dest = path.resolve(__dirname, 'netlify/functions/hl-full.json')
  const data = await fs.readFile(src, { encoding: 'utf-8' })
  if (!data) {
    throw new Error('No source text found')
  }
  await fs.writeFile(dest, JSON.stringify({ licenseHTML: data }, null, 2))
  console.log('Done with work')
}
prepareLambdas().catch((err) =>
  console.error('Failed to prepare Lambda dependencies. Error was', err)
)
