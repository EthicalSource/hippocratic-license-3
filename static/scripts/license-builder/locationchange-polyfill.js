// Not possible to listen for URL changes unless this is
// added.
// See: https://stackoverflow.com/questions/6390341/how-to-detect-if-url-has-changed-after-hash-in-javascript
const enableLocationChangeEvent = () => {
  history.pushState = ((f) =>
    function pushState() {
      var ret = f.apply(this, arguments)
      window.dispatchEvent(new Event('pushstate'))
      window.dispatchEvent(new Event('locationchange'))
      return ret
    })(history.pushState)

  history.replaceState = ((f) =>
    function replaceState() {
      var ret = f.apply(this, arguments)
      window.dispatchEvent(new Event('replacestate'))
      window.dispatchEvent(new Event('locationchange'))
      return ret
    })(history.replaceState)

  window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('locationchange'))
  })
}

enableLocationChangeEvent()
