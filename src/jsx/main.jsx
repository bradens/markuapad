import React from "react";

import Editor from "./editor";
import Toolbar from "./toolbar";
import FileBrowser from "./file_browser";
import Preview from "./preview";
import LivePreview from "./live_preview";
import FileAccessor from "../file_accessor";
import ImageModal from "./image_modal";
import _ from "underscore";

import { getCached } from "../util"

class Main extends React.Component {
  constructor(props) {
    super(props);

    // Setup some initial state
    this.state = {
      currentFile: null,
      imageFile: null,
      previewState: 'closed',
      inLiveMode: true,
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
    this.onManuscriptChange = this.onManuscriptChange.bind(this);
    this.onFileAdded = this.onFileAdded.bind(this);
    this.onPreviewImage = this.onPreviewImage.bind(this);

    // File access hooks
    FileAccessor.onDelete(this.onManuscriptChange);
    FileAccessor.onManuscriptChange(this.onManuscriptChange);
    FileAccessor.onAdd(this.onFileAdded);
  }

  // Lifecycle methods
  componentDidMount() {
    // Trigger a preview right away -- since we start in live mode
    this.onGeneratePreview();
  }

  // File event operations
  onFileAdded(file) {
    this.setState({ currentFile: file });
  }

  onManuscriptChange() {
    // Re-preview
    if (this.state.inLiveMode)
      this.onGeneratePreview();
  }

  onPreviewImage(file) {
    this.setState({ imageFile: file });
  }

  onChangeFile(file) {
    this.setState({ currentFile: file });
  }

  // Preview based methods
  onPreviewReady(errors, html) {
    // If someone has already stopped the preview then just bail
    if (this.state.previewState === "closed")
      return

    this.setState({ previewHtml: html, previewState: "done", previewErrors: errors })
  }

  onGeneratePreview(e) {
    // Call out to the markua processor
    this.setState({ previewState: "previewing" });
    this.props.markua.run(this.onPreviewReady, { cursor: getCached("markuapad_cursor") })
  }

  onClosePreview(e) {
    this.setState({ previewState: "closed" })
  }

  toggleLiveMode() {
    // Clear the preview state here as well, so we don't accidentally open a preview
    this.setState({ inLiveMode: !this.state.inLiveMode, previewState: "closed" }, () => {
      window.dispatchEvent(new Event('resize'));

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
            <FileBrowser onPreviewImage={this.onPreviewImage} onChangeFile={this.onChangeFile} currentFile={this.state.currentFile} projectRoot={this.props.projectRoot }/>
            <Editor
              onBookContentChanged={this.onBookContentChanged}
              inLiveMode={this.state.inLiveMode}
              currentFile={this.state.currentFile}
              CHANGED_INTERVAL={this.props.options.CHANGED_INTERVAL}
            />
            { this.state.inLiveMode ? <LivePreview key='live-mode' ref="liveMode" html={this.state.previewHtml} previewState={this.state.previewState} previewErrors={this.state.previewErrors} /> : null }
          </section>
        </section>
        { this.state.inLiveMode ? <span /> : <Preview key='preview' onClosePreview={this.onClosePreview} html={this.state.previewHtml} previewState={this.state.previewState} previewErrors={this.state.previewErrors} /> }
        { this.state.imageFile ? <ImageModal file={this.state.imageFile} onClose={ _.partial(this.onPreviewImage, null) } /> : null }
      </section>
    );
  }
}

Main.propTypes = {
  markua: React.PropTypes.object.isRequired,
  bookTitle: React.PropTypes.string.isRequired,
  projectRoot: React.PropTypes.string.isRequired,
  options: React.PropTypes.object.isRequired
};

export default Main;