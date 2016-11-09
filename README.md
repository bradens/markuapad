# Markuapad
### A web editor for creating markua documents.

This project is a web editor that is in use at [markuapad.com](http://markuapad.com) and will be integrated into  [leanpub.com](https://leanpub.com).

It's used to create any document written in the [markua](https://leanpub.com/markua) format.

This is the alpha release and is not yet close to stable.  Use at your own risk!

It's written and maintained by [Braden Simpson](http://github.com/bradens), but we would love to have your pull requests :smile:

### Installation

You can use this project by including it in your package.json, then including the
`markuapad.scss` file, and the `build/bundle.js` file. then call `$(element).markuapad(options)`.

### Development

#### Ensure that you have webpack installed
`npm install -g webpack`
`npm install webpack-dev-server -g`

#### Get the code
Run the following:

* `git clone https://github.com/markuadoc/markuapad`
* `cd markuapad`
* `npm install && bower install`
* `webpack-dev-server`

#### To deploy the gem

* `./prepare_gem`
* update lib/markuapad/version.rb
* `gem build markuapad.gemspec`
* `gem push markuapad-<version>.gem`

and you should be up an running on `http://localhost:8080`
