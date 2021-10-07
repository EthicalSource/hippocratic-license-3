export const isModuleActive = ({
  id,
  sourceUrl = window.location.href,
} = {}) => {
  const segments = sourceUrl.split('/')
  const lastSegment = segments[segments.length - 1]
  return lastSegment.includes(id)
}

export const getActiveModules = ({ sourceUrl = window.location.href } = {}) => {
  const segments = sourceUrl.split('/')
  const lastSegment = segments[segments.length - 1]
  if (lastSegment.includes('#')) {
    return lastSegment.split('#')[1].split('-')
  }
  return lastSegment.split('-').slice(1)
}

/**
 * createModuleLink looks at the current
 * window url and figures out what the url
 * should be changed to if a user wants to
 * add or remove a module.
 *
 * There is a difference between localhost
 * and production here because on localhost
 * we choose to rely on using hl#eco-soc for
 * denoting what license we are building.
 *
 * In production we can use SPA redirect
 * support to remove the need for # and thus
 * have plain links like hl-bsd-eco
 */
export const createModuleLink = ({
  sourceUrl = window.location.href,
  addModule,
  removeModule,
} = {}) => {
  const modules = getActiveModules({ sourceUrl })
  const segments = sourceUrl.split('/')
  const firstSegments = segments.slice(0, segments.length - 1)
  const isLocalhost = sourceUrl.indexOf('localhost') !== -1
  if (addModule) {
    modules.push(addModule)
    firstSegments.push(
      [`${isLocalhost ? '#' : 'hl-'}`, modules.sort().join('-')].join('')
    )
    return firstSegments.join('/')
  }
  const filteredModules = modules
    .filter((m) => m !== removeModule)
    .sort()
    .join('-')
  firstSegments.push([`${isLocalhost ? '#' : 'hl-'}`, filteredModules].join(''))
  return firstSegments.join('/')
}

// cr is just a shortform for document.createElement
export const cr = (...args) => document.createElement(...args)
