/**
 * Purpose: Process a tree of nodes, find poential linkable links
 * and turn them into internal page-links. Furthermore, it will
 * also ensure that they are incremented properly.
 *
 * Example. Given a list of items as such.
 *
 * 1.
 * 2.
 *   1.1
 *     1.2.1.
 *   1.1.
 * 3.
 *  3.1.
 *  3.1.
 *
 * It will be converted to:
 * 1.
 * 2.
 *   2.1
 *     2.1.1.
 *   2.2.
 * 3.
 *  3.1.
 *  3.2.
 *
 * This function can be run several times and will
 * just keep updating the numbers in a way that respects
 * the sequence.
 *
 * Some assumptions this logic relies on:
 *
 * List depth changes only one level at a time. Example: From 1. to 1.1.
 * Text is only made linkable if it's a node that starts with some number "1.".
 *
 * @returns Nothing, it mutates the list of nodes.
 */
export const incrementAndLinkify = ({
  // List of HTML nodes
  nodes,
  // Allow replacing window server-side or in tests.
  window: { document } = window,
}) => {
  // Find all linkable nodes with regex
  // Locates numbers such as 1.1, 1.2, 1.2.345
  const numRE = /^([\d+\.]+)/i
  const sequence = []
  const processChildren = (child) => {
    if (child.style.display === 'none') {
      // Don't process hidden elements.
      return
    }
    const matchedTextNode = Array.from(child.childNodes).find(
      (c, index) =>
        index === 0 && c.nodeName === '#text' && numRE.test(c.textContent)
    )
    if (!matchedTextNode) {
      Array.from(child.children).forEach(processChildren)
      return
    }
    const match = numRE.exec(matchedTextNode.textContent)
    const [, numberStr] = match
    if (!numberStr.endsWith('.')) {
      throw new Error(
        `Found sections numbering ${numberStr} that doesn't end with punctuation. Full Sentence was "${match.input}". Opting to be strict. Erroring out.`
      )
    }
    const thisNumbering = buildNextSequenceItem({
      sequence,
      source: numberStr,
    })
    // Handle if section has already been converted to link.
    const link = child.tagName === 'A' ? child : document.createElement('a')
    const id = thisNumbering.join('.')
    link.id = id
    link.href = `#${id}`
    link.textContent = `${id}.`
    // No need to do more if we just updated a link.
    if (child.tagName === 'A') {
      sequence.push(thisNumbering)
      return
    }
    // Otherwise we're building a brand new link.
    // Some of this node's text will be made into a link
    // and the rest of the text will be put into a adjacent
    // text node.
    const restOfText = match.input.slice(numberStr.length)
    const restOfTextNode = document.createTextNode(restOfText)
    child.replaceChild(restOfTextNode, matchedTextNode)
    child.insertBefore(link, restOfTextNode)
    sequence.push(thisNumbering)
  }
  Array.from(nodes).forEach(processChildren)
}

/**
 * buildNextSequenceItem looks at a given sequence and then figures out
 * what the next incremented list item should be.
 *
 * See the tests for more information about how this function acts on
 * input.
 */
export function buildNextSequenceItem({ sequence, source: stringOrArray }) {
  // Convert to array, if not already done.
  const source = Array.isArray(stringOrArray)
    ? stringOrArray
    : stringOrArray
        .split('.')
        .filter((str) => str)
        .map((str) => Number.parseInt(str, 10))
  if (sequence.length === 0) {
    return source
  }
  const previousItem = sequence[sequence.length - 1].slice()
  if (previousItem.length === source.length) {
    const lastNum = previousItem.pop()
    return [...previousItem, lastNum + 1]
  } else if (previousItem.length < source.length) {
    return [...previousItem, 1]
  } else if (previousItem.length > source.length) {
    const sliced = previousItem.slice(0, source.length - previousItem.length)
    const lastNum = sliced.pop()
    return [...sliced, lastNum + 1]
  }
}
