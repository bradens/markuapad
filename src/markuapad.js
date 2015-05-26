// Get the stylesheet
require("./styles/app.scss");

import _ from "underscore";
import Main from "./jsx/main";
import React from "react";

let DEFAULT_OPTIONS = {
  fileAccessor: {
    get(path, cb) {
      console.log("You must implement the fileAccessor method for Markuapad to work.  See https://github.com/markuadoc/markuapad#installation");
      cb(null);
    },
    getSync(path) {
      console.log("You must implement the fileAccessor method for Markuapad to work.  See https://github.com/markuadoc/markuapad#installation");
      return null;
    }
  }
}

class Markuapad {
  constructor() {
    this.options = DEFAULT_OPTIONS;
  }

  create(elementId, options = {}) {
    this.options = _.extend(this.options, options);
    React.render(React.createFactory(Main)(), document.getElementById(elementId));
  }
}

export default new Markuapad();