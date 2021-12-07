# HL3 (with license builder)

(Temporarily private) working repo for HL3 site with license builder.

Preview of release branch: https://hl3.netlify.app

## Notes

### How the HL3 license builder works

1. Users interact with the license builder by adding/removing modules. This changes the URL.
    - Example URL: https://firstdonoharm.dev/build/?modules=extr,mil,usta 
    - The `?modules` part of the URL is a query parameter and several custom HTML elements have been programmed to react to the browser URL changing by adding or removing relevant license modules.
    - See `/static/scripts` for details about the license builder interactivity.
1. When satisfied with their configured license users can then click a link within the license builder to download the license text as HTML, Markdown or plaintext. 
    - Examples of URL links:
    - https://firstdonoharm.dev/version/3/0/extr-mil-usta.html
    - https://firstdonoharm.dev/version/3/0/full.txt
    - These URLs are re-routed by Netlify (see `netlify.toml`) to a Netlify [on-demand-builder](https://docs.netlify.com/configure-builds/on-demand-builders/) function `download-license.js` which builds the configured license and serves it in the correct file format.
    - See the `/netlify/` folder for relevant Netlify functions and corresponding test(s).
    - Also see `netlify.toml` for particularities to the build pipeline required by the Netlify function. 

## Reference
* HL2 repo: https://github.com/EthicalSource/hippocratic-license
* HL2 site: https://firstdonoharm.dev

## Attribution
* Uses icon SVGs from [heroicons](https://heroicons.com)