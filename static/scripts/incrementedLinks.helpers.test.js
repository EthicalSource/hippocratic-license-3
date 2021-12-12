import test from 'ava'
import { JSDOM } from 'jsdom'
import {
  incrementAndLinkify,
  buildNextSequenceItem,
} from './incrementedLinks.helpers.js'

test('should be able to increment and linkify sections', (t) => {
  const sourceDOM = new JSDOM(`
    <p>1. MyTitle</p>
    <ul>
      <li><p>1.1.</p></li>
      <li>
        <p>1.1.</p>
        <ul>
        <li><p>1.1.1.<em>emphasized</em> subject</p></li>
        <li><p>1.1.1.</p></li>
        <li style="display:none;"><p>1.1.1.</p></li>
        </ul>
      </li>
      <li><p>1.1.</p></li>
    </ul>
  `)
  const expectedDOM = new JSDOM(`
    <p><a id="1" href="#1">1.</a> MyTitle</p>
    <ul>
      <li><p><a id="1.1" href="#1.1">1.1.</a></p></li>
      <li>
        <p><a id="1.2" href="#1.2">1.2.</a></p>
        <ul>
        <li><p><a id="1.2.1" href="#1.2.1">1.2.1.</a><em>emphasized</em> subject</p></li>
        <li><p><a id="1.2.2" href="#1.2.2">1.2.2.</a></p></li>
        <li style="display:none;"><p>1.1.1.</p></li>
        </ul>
      </li>
      <li><p><a id="1.3" href="#1.3">1.3.</a></p></li>
    </ul>
  `)
  const nodes = sourceDOM.window.document.body.children
  incrementAndLinkify({ nodes, window: sourceDOM.window })
  t.is(sourceDOM.serialize(), expectedDOM.serialize())
})

test('re-running linkify function should work', (t) => {
  const sourceDOM = new JSDOM(`
    <p><a id="1" href="#1">1.</a> MyTitle</p>
    <ul>
      <li><p><a id="1.1" href="#1.1">1.1.</a></p></li>
      <li>
        <p><a id="1.2" href="#1.2">1.2.</a></p>
        <ul>
        <li style="display:none;"><p><a id="1.2.1" href="#1.2.1">1.2.1.</a></p></li>
        <li><p><a id="1.2.1" href="#1.2.1">1.2.1.</a></p></li>
        <li><p><a id="1.2.1" href="#1.2.1">1.2.1.</a></p></li>
        </ul>
      </li>
      <li><p><a id="1.3" href="#1.3">1.3.</a></p></li>
    </ul>
  `)
  const expectedDOM = new JSDOM(`
    <p><a id="1" href="#1">1.</a> MyTitle</p>
    <ul>
      <li><p><a id="1.1" href="#1.1">1.1.</a></p></li>
      <li>
        <p><a id="1.2" href="#1.2">1.2.</a></p>
        <ul>
        <li style="display:none;"><p><a id="1.2.1" href="#1.2.1">1.2.1.</a></p></li>
        <li><p><a id="1.2.1" href="#1.2.1">1.2.1.</a></p></li>
        <li><p><a id="1.2.2" href="#1.2.2">1.2.2.</a></p></li>
        </ul>
      </li>
      <li><p><a id="1.3" href="#1.3">1.3.</a></p></li>
    </ul>
  `)
  const nodes = sourceDOM.window.document.body.children
  incrementAndLinkify({ nodes, window: sourceDOM.window })
  t.is(sourceDOM.serialize(), expectedDOM.serialize())
})

test('should not modify this section', (t) => {
  const sourceDOM = new JSDOM(`
  <p><em>This section identifies intellectual property rights granted to a Licensee</em>.</p>
`)
  const original = sourceDOM.serialize()
  const nodes = sourceDOM.window.document.body.children
  incrementAndLinkify({ nodes, window: sourceDOM.window })
  t.is(sourceDOM.serialize(), original, 'Failed to leave section alone')
})

test('not ending a section numbering with punctuation is a hard error.', (t) => {
  const sourceDOM = new JSDOM(`
    <p>1.1 Bad section</p>
  `)
  t.throws(() =>
    incrementAndLinkify({ nodes: sourceDOM.window.document.body.children })
  )
})

test('handle simple increment', (t) => {
  const sequence = [[1], [1, 1]]
  const source = [1, 1] // 1.1.
  t.deepEqual(buildNextSequenceItem({ sequence, source }), [1, 2])
})

test('handle no previous sub-list', (t) => {
  const sequence = [[1], [2], [3], [3, 1]]
  const source = [1] // 1.1.
  t.deepEqual(buildNextSequenceItem({ sequence, source }), [4])
})

test('handle multiple sub-lists', (t) => {
  const sequence = [[1], [1, 1], [2], [2, 1], [3]]
  const source = [1, 1]
  t.deepEqual(buildNextSequenceItem({ sequence, source }), [3, 1])
})
