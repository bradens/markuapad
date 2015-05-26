// Get the stylesheet
require("./styles/app.scss");

import Main from "./jsx/main";
import React from "react";

class Markuapad {
  constructor() {
    console.log("Creating a new instance of the markuapad");
  }

  create(elementId, options = {}) {
    React.render(React.createFactory(Main)(), document.getElementById(elementId));
  }
}

export default new Markuapad();