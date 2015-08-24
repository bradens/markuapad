import React from "react";

import Editor from "./editor";
import Toolbar from "./toolbar";
import FileBrowser from "./file_browser";
import Preview from "./preview";
import LivePreview from "./live_preview";
import FileAccessor from "../file_accessor";
import ImageModal from "./image_modal";
import _ from "underscore";
import MergeConflictModal from './merge_conflict_modal'

import { getCached } from "../util"

class Main extends React.Component {
  constructor(props) {
    super(props);

    // Setup some initial state
    this.state = {
      currentFile: null,
      imageFile: null,
      previewState: 'closed',
      inLiveMode: this.props.options.enablePreview,
      previewHtml: "",
      isResolvingMergeConflicts: false,
      mergeConflicts: null
    }

    // File access hooks
    FileAccessor.onDelete(this.onManuscriptChange);
    FileAccessor.onManuscriptChange(this.onManuscriptChange);
    FileAccessor.onAdd(this.onFileAdded);
    FileAccessor.onProgress(this.onProgress);
    FileAccessor.onProgressStarted(this.onProgressStarted);
    FileAccessor.onMergeConflicts(this.onMergeConflicts);
  }

  // Lifecycle methods
  componentDidMount() {
    // Trigger a preview right away if we are in live mode
    if (this.state.inLiveMode)
      this.onGeneratePreview();
  }

  // parameter conflicts is an array of tuples.
  // { filename: String, serverVersion: String, clientVersion: String }
  onMergeConflicts = (conflicts) => {
    this.setState({
      mergeConflicts: conflicts,
      isResolvingMergeConflicts: true
    })
  }

  doneResolvingConflicts = () => {
    this.setState({ mergeConflicts: null, isResolvingMergeConflicts: false })
  }

  // File event operations
  onFileAdded = (file) => {
    this.setState({ currentFile: file });
  }

  onManuscriptChange = () => {
    // Re-preview
    if (this.state.inLiveMode)
      this.onGeneratePreview();
  }

  onProgress = (progressType) => {
    this.setState({ progressType: progressType, inProgress: false })

    clearInterval(this.progressUpdateInterval)

    this.progressUpdateInterval = setTimeout(() => {
      this.setState({ progressType: null })
    }, 1000)
  }

  onProgressStarted = () => {
    this.setState({ inProgress: true })
  }

  onPreviewImage = (file) => {
    this.setState({ imageFile: file });
  }

  onChangeFile = (file) => {
    this.setState({ currentFile: file });
  }

  // Preview based methods
  onPreviewReady = (errors, html) => {
    // If someone has already stopped the preview then just bail
    if (this.state.previewState === "closed")
      return

    this.setState({ previewHtml: html, previewState: "done", previewErrors: errors })
  }

  onGeneratePreview = (e) => {
    // Call out to the markua processor
    this.setState({ previewState: "previewing" });
    this.props.markua.run(this.onPreviewReady, { cursor: getCached("markuapad_cursor") })
  }

  onClosePreview = (e) => {
    this.setState({ previewState: "closed" })
  }

  toggleLiveMode = () => {
    // Clear the preview state here as well, so we don't accidentally open a preview
    this.setState({ inLiveMode: !this.state.inLiveMode, previewState: "closed" }, () => {
      window.dispatchEvent(new Event('resize'));

      // If we transition into live mode, then kick off an initial preview;
      if (this.state.inLiveMode)
        this.onGeneratePreview();
    });
  }

  onBookContentChanged = () => {
    if (this.state.inLiveMode)
      this.onGeneratePreview();
  }

  getWorkspaceClass = () => {
    let workspaceClass = `workspace`;
    workspaceClass += this.state.inLiveMode ? ' live' : '';
    return workspaceClass;
  }

  render() {
    return (
      <section className="markuapad">
        <Toolbar
          inProgress={this.state.inProgress}
          progressType={this.state.progressType}
          bookTitle={this.props.bookTitle}
          onGeneratePreview={this.onGeneratePreview}
          toggleLiveMode={this.toggleLiveMode}
          inLiveMode={this.state.inLiveMode}
          enablePreview={this.props.options.enablePreview}
        />
        <section className="main-view">
          <section className={this.getWorkspaceClass()}>
            <FileBrowser blacklistedFiles={this.props.options.blacklistedFiles} onPreviewImage={this.onPreviewImage} onChangeFile={this.onChangeFile} currentFile={this.state.currentFile} projectRoot={this.props.projectRoot }/>
            <Editor
              onBookContentChanged={this.onBookContentChanged}
              inLiveMode={this.state.inLiveMode}
              currentFile={this.state.currentFile}
              CHANGED_INTERVAL={this.props.options.CHANGED_INTERVAL}
            />
            { this.state.inLiveMode ? <LivePreview key='live-mode' ref="liveMode" html={this.state.previewHtml} previewState={this.state.previewState} previewErrors={this.state.previewErrors} /> : null }
          </section>
        </section>
        { this.state.inLiveMode ? <span /> : <Preview key='preview' inLiveMode={this.state.inLiveMode} onClosePreview={this.onClosePreview} html={this.state.previewHtml} previewState={this.state.previewState} previewErrors={this.state.previewErrors} /> }
        { this.state.imageFile ? <ImageModal file={this.state.imageFile} onClose={ _.partial(this.onPreviewImage, null) } /> : null }
        { this.state.isResolvingMergeConflicts ? <MergeConflictModal conflicts={this.state.mergeConflicts} onClose={this.doneResolvingConflicts} /> : null }
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