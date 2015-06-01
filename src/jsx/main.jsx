import React from "react";

import Editor from "./editor";
import Toolbar from "./toolbar";
import FileBrowser from "./file_browser";
import Preview from "./preview";
import LivePreview from "./live_preview";

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentFile: `book.txt`,
      previewState: 'closed',
      inLiveMode: false,
      previewHtml: ""
    }

    // Autobind
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onGeneratePreview = this.onGeneratePreview.bind(this);
    this.onPreviewReady = this.onPreviewReady.bind(this);
    this.onClosePreview = this.onClosePreview.bind(this);
    this.toggleLiveMode = this.toggleLiveMode.bind(this);
    this.onBookContentChanged = this.onBookContentChanged.bind(this);
    this.getWorkspaceClass = this.getWorkspaceClass.bind(this);
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

  toggleLiveMode() {
    // Clear the preview state here as well, so we don't accidentally open a preview
    this.setState({ inLiveMode: !this.state.inLiveMode, previewState: 'live' }, () => {
      // If we transition into live mode, then kick off an initial preview;
      if (this.state.inLiveMode)
        this.onGeneratePreview();
    });
  }

  onBookContentChanged() {
    if (this.state.inLiveMode)
      this.onGeneratePreview();
  }

  getWorkspaceClass() {
    let workspaceClass = `workspace`;
    workspaceClass += this.state.inLiveMode ? ' live' : '';
    return workspaceClass;
  }

  render() {
    return (
      <section className="markuapad">
        <Toolbar
          bookTitle={this.props.bookTitle}
          onGeneratePreview={this.onGeneratePreview}
          toggleLiveMode={this.toggleLiveMode}
          inLiveMode={this.state.inLiveMode}
        />
        <section className="main-view">
          <section className={this.getWorkspaceClass()}>
            <FileBrowser onChangeFile={this.onChangeFile} currentFile={this.state.currentFile} projectRoot={this.props.projectRoot }/>
            <Editor
              onBookContentChanged={this.onBookContentChanged}
              inLiveMode={this.state.inLiveMode}
              currentFile={this.state.currentFile}
            />
            { this.state.inLiveMode ? <LivePreview html={this.state.previewHtml} previewState={this.state.previewState} previewErrors={this.state.previewErrors} /> : null }
          </section>
        </section>
        <Preview inLiveMode={this.state.inLiveMode} onClosePreview={this.onClosePreview} html={this.state.previewHtml} previewState={this.state.previewState} previewErrors={this.state.previewErrors} />
      </section>
    );
  }
}

Main.propTypes = {
  markua: React.PropTypes.object.isRequired,
  bookTitle: React.PropTypes.string.isRequired,
  projectRoot: React.PropTypes.string.isRequired,
  options: React.PropTypes.object.isRequired
}

export default Main;