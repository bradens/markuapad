import React from "react";

import Editor from "./editor";
import Toolbar from "./toolbar";
import FileBrowser from "./file_browser";
import Preview from "./preview";

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentFile: `book.txt`,
      previewState: 'closed'
    }

    // Autobind
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onGeneratePreview = this.onGeneratePreview.bind(this);
    this.onPreviewReady = this.onPreviewReady.bind(this);
    this.onClosePreview = this.onClosePreview.bind(this);
  }

  onChangeFile(filename) {
    this.setState({ currentFile: filename });
  }

  onPreviewReady(errors, html) {
    // If someone has already stopped the preview then just bail
    if (this.state.previewState === "closed")
      return

    this.setState({ previewHtml: html, previewState: "done", previewErrors: errors });
  }

  onGeneratePreview(e) {
    // Call out to the markua processor
    this.setState({ previewState: "previewing" });
    this.props.markua.run(this.onPreviewReady)
  }

  onClosePreview(e) {
    this.setState({ previewState: "closed" })
  }

  render() {
    return (
      <section className="markuapad large-container">
        <Toolbar onGeneratePreview={this.onGeneratePreview} />
        <section className="main-view">
          <FileBrowser onChangeFile={this.onChangeFile} currentFile={this.state.currentFile} projectRoot={this.props.projectRoot }/>
          <Editor currentFile={this.state.currentFile} />
        </section>
        <Preview onClosePreview={this.onClosePreview} html={this.state.previewHtml} previewState={this.state.previewState} previewErrors={this.state.previewErrors} />
      </section>
    );
  }
}

export default Main;