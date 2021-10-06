export const isModuleActive = ({
  id,
  sourceUrl = window.location.href,
} = {}) => {
  const segments = sourceUrl.split('/')
  const lastSegment = segments[segments.length - 1]
  return lastSegment.includes(moduleID)
}

export const getActiveModules = ({ sourceUrl = window.location.href } = {}) => {
  const segments = sourceUrl.split('/')
  const lastSegment = segments[segments.length - 1]
  if (lastSegment.includes('#')) {
  }
}

// cr is just a shortform for document.createElement
export const cr = (...args) => document.createElement(...args)
