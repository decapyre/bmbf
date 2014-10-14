# Getting Started
- Have NodeJs installed with npm
- Have grunt installed: `npm install -g grunt-cli`
- Have Bower installed: `npm install -g bower`
- Run `npm install`
- Run `bower install`
- Run `grunt serve` to go into live edit mode.

# Notes
- This project uses SASS for css generation and The Foundation 5 Framework. Please follow these standards when editing this project.

### How to Build
- Run `grunt build`, files are concatenated and minified to /dist

### How to Develop/edit
- Run `grunt serve`, all changes are updated with livereload in the browser.

### How to get only the concatenated css/styles
- Go to the .tmp folder
- Here you will find a concat folder with unminified javascript scripts and in the styles folder you will find the unminified concatenated css.