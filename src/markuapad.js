require("./styles/app.scss");

import Editor from "./jsx/editor";
import React from "react";

class Markuapad {
  constructor() {
    console.log("Creating a new instance of the markuapad");
  }

  create(elementId) {
    React.render(React.createFactory(Editor)(), document.getElementById(elementId));
  }
}

export default new Markuapad();