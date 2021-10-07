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

export const createModuleLink = ({
  sourceUrl = window.location.href,
  addModule,
  removeModule,
} = {}) => {}

// cr is just a shortform for document.createElement
export const cr = (...args) => document.createElement(...args)
