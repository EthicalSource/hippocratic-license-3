export const isModuleActive = ({
  id,
  sourceUrl = window.location.href,
} = {}) => {
  const modules = getActiveModules({ sourceUrl })
  return modules.includes('full') || modules.includes(id)
}

export const getActiveModules = ({ sourceUrl = window.location.href } = {}) => {
  const modulesStr = new URL(sourceUrl).searchParams.get('modules')
  if (!modulesStr) {
    return []
  }
  const allModules = getAllModules().map(({ id }) => id)
  const activeModules = modulesStr.split(',')
  if (activeModules.includes('full')) {
    return allModules
  }
  return activeModules
}

/**
 * createModuleLink looks at the current
 * window url and figures out what the url
 * should be changed to if a user wants to
 * add or remove a module.
 */
export const createModuleLink = ({
  sourceUrl = window.location.href,
  addModule,
  removeModule,
} = {}) => {
  const modules = getActiveModules({ sourceUrl })
  const url = new URL(sourceUrl)
  const updatedModules = modules.filter(
    (m) => !removeModule || m !== removeModule
  )
  if (addModule && !updatedModules.includes(addModule)) {
    updatedModules.push(addModule)
  }
  if (updatedModules.length === 0) {
    return `${url.origin}${url.pathname}`
  }
  const allModules = getAllModules().map(({ id }) => id)
  if (updatedModules.length === allModules.length) {
    return `${url.origin}${url.pathname}?modules=full`
  }
  return `${url.origin}${url.pathname}?modules=${updatedModules
    .sort()
    .join(',')}`
}

export const getAllModules = () => {
  // When testing there's no global window.document
  // so we simply return an empty list here. If we actually
  // want to test this we should make this data mockable.
  if (typeof document === 'undefined') {
    return []
  }
  return Array.from(document.querySelectorAll('license-module')).map((node) => {
    return {
      id: node.getAttribute('mod-id'),
      title: node.getAttribute('title'),
      helpText: node.getAttribute('helpText'),
    }
  })
}

// cr is just a shortform for document.createElement
export const cr = (...args) => document.createElement(...args)

/**
 * buildHTML instantiates HTML nodes from a string.
 * @param {string} htmlString Any valid html.
 * @returns {Object[]} proper HTML nodes.
 */
export const buildHTML = (htmlString) => {
  const template = cr('template')
  template.innerHTML = htmlString
  return template.content.cloneNode(true)
}
