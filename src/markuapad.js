// Get the stylesheet
require("./styles/app.scss");

import _ from "underscore";
import Main from "./jsx/main";
import React from "react";
import Markua from "markua-js"
import FileAccessor from "./file_accessor"

let DEFAULT_OPTIONS = {
  fileAccessor: ExampleFileAccessor
}

class Markuapad {
  constructor() {
    this.options = DEFAULT_OPTIONS;
  }

  create(elementId, options = {}) {
    // apply options to defaults
    this.options = _.extend(this.options, options);

    // Project Root
    // TODO: make it real...maybe allow creation?
    let projectRoot = "example";

    // Instantiate a new markua processor instance
    this.markua = new Markua(projectRoot, { fileAccessor: this.options.fileAccessor })

    // Setup the markuapad file accessor
    FileAccessor.setup(this.options.fileAccessor, projectRoot);

    // Render the markuapad
    React.render(React.createFactory(Main)({ options: options, markua: this.markua, projectRoot: projectRoot }), document.getElementById(elementId));
  }
}

export default new Markuapad();