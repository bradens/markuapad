import React from "react";

import Editor from "./editor";
import Toolbar from "./toolbar";
import FileBrowser from "./file_browser";

class Main extends React.Component {
  render() {
    return (
      <section className="markuapad large-container">
        <Toolbar />
        <section className="main-view">
          <FileBrowser />
          <Editor />
        </section>
      </section>
    );
  }
}

export default Main;