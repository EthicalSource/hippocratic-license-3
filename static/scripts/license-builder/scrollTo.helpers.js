/**
 * Given an id and an optional offset it will scroll to
 * the target HTML element.
 * @param {Object}
 * @returns
 */
export const scrollTo = ({ id, offset = 0 }) => {
  const targetNode = document.getElementById(id)
  if (!targetNode) {
    console.warn('Did not find scroll target with id:', id)
    return // nothing to scroll to
  }
  const { top } = targetNode.getBoundingClientRect()
  const offsetPosition = top + window.pageYOffset - offset
  window.scrollTo({ top: offsetPosition })
  targetNode.focus()
}
