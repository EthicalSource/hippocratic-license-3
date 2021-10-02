import fs from 'fs'
import path from 'path'
import util from 'util'
import combinations from 'combinations'
import * as cheerio from 'cheerio'

/**
 * loadBaseLicenseHTML loads the base HTML License file
 * @returns String HTML
 */
export const loadBaseLicenseHTML = async () => {
  const filePath = path.resolve('./content/version/3/0/license.md')
  const readFile = util.promisify(fs.readFile)
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

const buildOutVersions = ({ folderPath, versions = [] }) => {}

/**
 * getCombinations finds all possible module combinations.
 * @param modules array of module IDs
 * @returns array of all possible module combinations.
 */
export const getCombinations = (modules = []) => {
  return combinations(modules).map((comb) => comb.join('-'))
}

const main = () => {}
