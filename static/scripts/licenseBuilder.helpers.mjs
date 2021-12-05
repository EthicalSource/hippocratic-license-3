export const isModuleActive = ({
  id,
  sourceUrl = window.location.href,
} = {}) => {
  const modules = getActiveModules({ sourceUrl })
  return modules.includes(id)
}

export const getActiveModules = ({ sourceUrl = window.location.href } = {}) => {
  const modulesStr = new URL(sourceUrl).searchParams.get('modules')
  if (!modulesStr) {
    return []
  }
  return modulesStr.split(',')
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
  if (addModule) {
    updatedModules.push(addModule)
  }
  if (updatedModules.length === 0) {
    return `${url.origin}${url.pathname}`
  }
  return `${url.origin}${url.pathname}?modules=${updatedModules
    .sort()
    .join(',')}`
}

// cr is just a shortform for document.createElement
export const cr = (...args) => document.createElement(...args)
