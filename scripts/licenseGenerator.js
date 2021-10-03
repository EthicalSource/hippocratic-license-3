import { readFile, copyFile } from 'fs/promises'
import path from 'path'
import combinations from 'combinations'
import * as cheerio from 'cheerio'
import rimraf from 'rimraf'
import util from 'util'

const defaultDirectory = './content/version/3/0'
const defaultLicenseSource = 'license-with-all-modules.html'

/**
 * loadBaseLicenseHTML loads the base HTML License file
 * @returns String HTML
 */
export const loadBaseLicenseHTML = async ({
  directory = defaultDirectory,
  license = defaultLicenseSource,
} = {}) => {
  const filePath = path.resolve(directory, license)
  return readFile(filePath, { encoding: 'utf-8' }).catch((err) => {
    console.log('Failed to read base license', err)
  })
}

/**
 * findAvailableModules parses HTML in search of modules
 * defined using a Hugo shortcode.
 * @param html text
 * @returns array of available modules
 */
export const findAvailableModules = (html) => {
  // Find shortcode 'mod' and locate 'id' attributes
  const re = /{{< mod [\w|\s|\"|\=]*id=\"([\w|\s|\-]*)\"/gi
  const modules = []
  let matches
  while ((matches = re.exec(html)) !== null) {
    modules.push(matches[1])
  }
  return modules
}

const removeLicenseVersions = async ({ directory = defaultDirectory } = {}) => {
  const target = path.resolve(directory, 'HL*')
  const rm = util.promisify(rimraf)
  return rm(target).catch((err) =>
    console.error('Failed to delete license versions', err)
  )
}

const buildOutVersions = async ({
  basePath = defaultDirectory,
  licenseSource = defaultLicenseSource,
  versions = [],
} = {}) => {
  const source = path.resolve(basePath, licenseSource)
  // Write the HL.html itself.
  const baseLicenseDestination = path.resolve(basePath, `HL.html`)
  await copyFile(source, baseLicenseDestination)
    .then(() => console.log('Wrote:', path.basename(baseLicenseDestination)))
    .catch((err) => console.error('Failed to write file', err))
  // Write all the versions
  for (const version of versions) {
    const destination = path.resolve(basePath, `HL-${version}.html`)
    await copyFile(source, destination)
      .then(() => console.log('Wrote:', path.basename(destination)))
      .catch((err) => console.error('Failed to write file', err))
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

if (process.env.NODE_ENV === 'clean') {
  console.log('Clearing license versions')
  await removeLicenseVersions()
} else if (process.env.NODE_ENV !== 'test') {
  main()
}
