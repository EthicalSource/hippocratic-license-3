# Contributing

## Getting started
Please check the [issues](https://github.com/EthicalSource/hippocratic-license/issues)
for the latest discussions, questions, and ideas for the Hippocratic License and this site.

## What you need to know
If you're new to contributing to projects hosted on Github, or need a refresher,
you may find [How to make your first pull request on GitHub](https://www.freecodecamp.org/news/how-to-make-your-first-pull-request-on-github-3/)
a useful resource.

## Adding your project to the list of adopters
* Fork the repository.
* Add a new row to the [adopters.csv](static/adopters.csv) file,
  with the project name in the first column, and the project URL in the second column.
* Open a pull request.

## We value your effort and contributions
If your financial or other circumstances are a barrier to your participation in this project, please [contact us](https://ethicalsource.dev/contact/) to discuss the possibility of sponsorship.

## Standards and norms

### Code of conduct
All participants in this project agree to abide by the terms of our code of conduct, which we strive to enforce with compassion, empathy, safety, and fairness.

### Accessibility
- [Accessibility is a human right](https://ethicalsource.dev/principles).
- Test any CSS or HTML changes with the [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org)

### Code Style
- Use spaces for indentation
- Order properties alphabetically

### HTML
- Include `alt` attribute for all images
- Include `title` attribute for all links
- Close all your tags properly

### CSS
- Try to use classes instead of IDs unless things are absolutely unique
- One selector per line
- Support IE 9 and above
- Use `rem` over `em` or `px`
- Capitalize hexadecimal
- Breaking lines should be `1px solid #CCC`
- Maintain [contrast](https://webaim.org/resources/contrastchecker/) to WCAG AA on normal text, WCAG AAA on large text
- Use colors from [this palette](https://color.adobe.com/Royal-Purples-color-theme-7468845/edit/?copy=true&base=2&rule=Custom&selected=4&name=Copy%20of%20Royal%20Purples&mode=rgb&rgbvalues=0.2980392156862745,0.06666666666666667,0.3803921568627451,0.8,0.14901960784313725,0.1411764705882353,0.403921568627451,0,0.6784313725490196,0.5372549019607843,0.12156862745098039,0.6784313725490196,1,0.7137254901960784,0.08627450980392157&swatchOrder=0,1,2,3,4)

### Markdown
- You do not need to use smart quotes, em- or en-dashes, etc.; the Markdown processor will handle that.

## Building the website for local development
To build the website locally, first [install Hugo](https://gohugo.io/getting-started/installing)
using your package manager of choice.
For example, on Debian/Ubuntu:
```
apt-get install hugo
```

If you are using Arch Linux:
```
pacman -S hugo
```

If you are using [Homebrew](https://brew.sh) on macOS:
```
brew install hugo
```

#### Start the server
From the repository's root directory, start the development server:
```
hugo server -D
```
