import { readFile, copyFile } from 'fs/promises'
import path from 'path'
import combinations from 'combinations'
import * as cheerio from 'cheerio'
import rimraf from 'rimraf'
import util from 'util'

/**
 * loadBaseLicenseHTML loads the base HTML License file
 * @returns String HTML
 */
export const loadBaseLicenseHTML = async () => {
  const filePath = path.resolve('./content/version/3/0/license.html')
  return readFile(filePath, { encoding: 'utf-8' }).catch((err) => {
    console.log('Failed to read base license', err)
  })
}

/**
 * findAvailableModules parses HTML in search of HTML elements
 * marked with the data-attribute 'data-module-id' signifying an
 * individual module.
 * Learn more about data attributes here:
 * https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
 * @param html text
 * @returns array of available modules
 */
export const findAvailableModules = (html) => {
  const $ = cheerio.load(html)
  const modules = []
  const moduleKey = 'data-module-id'
  $(`[${moduleKey}]`).each((i, elem) => {
    modules[i] = elem.attribs[moduleKey]
  })
  return modules
}

const removeLicenseVersions = async () => {
  const target = path.resolve('./content/version/3/0/HL-*')
  const rm = util.promisify(rimraf)
  return rm(target).catch((err) =>
    console.error('Failed to delete license versions', err)
  )
}

const buildOutVersions = async ({ versions = [] }) => {
  const basePath = './content/version/3/0'
  const source = path.resolve(basePath, 'license.html')
  for (const version of versions) {
    const destination = path.resolve(basePath, `HL-${version}.html`)
    try {
      await copyFile(source, destination)
      console.log('Wrote:', path.basename(destination))
    } catch (err) {
      console.error('Failed to write file', err)
    }
  }
}

/**
 * getCombinations finds all possible module combinations.
 * @param modules array of module IDs
 * @returns array of all possible module combinations.
 */
export const getCombinations = (modules = []) => {
  return combinations(modules.map((m) => m.toUpperCase())).map((comb) =>
    comb.join('-')
  )
}

const main = async () => {
  console.log('Clearing license versions')
  await removeLicenseVersions()
  console.log('Generating license versions')
  const text = await loadBaseLicenseHTML()
  const modules = findAvailableModules(text)
  const versions = getCombinations(modules)
  await buildOutVersions({ versions })
  console.log('Done with work')
}

if (process.env.NODE_ENV === 'clear') {
  console.log('Clearing license versions')
  await removeLicenseVersions()
} else if (process.env.NODE_ENV !== 'test') {
  main()
}
