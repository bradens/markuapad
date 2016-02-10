import React from "react";
import ace from "brace";
import javascript from "brace/mode/markdown";
import monokai from "brace/theme/xcode";
import FileAccessor from "../file_accessor";
import _ from "underscore";

let EDITOR_KEY = 1;

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.onCurrentFileLoaded = this.onCurrentFileLoaded.bind(this);

    // Make the editor changed function not spammy
    this.onEditorChanged = _.debounce(this.onEditorChanged.bind(this), props.CHANGED_INTERVAL || 100);
    this.onCursorChanged = this.onCursorChanged.bind(this)
  }

  // Setup all the editor options when we mount.
  componentDidMount() {
    this.loadFile();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.currentFile !== this.props.currentFile) {
      if (this.editor) {
        this.editor.destroy();
        EDITOR_KEY = EDITOR_KEY + 1;
      }
    }
  }

  // If we get a file change from outside our domain, switch to it.
  // TODO: maybe show a merge warning or something?
  componentDidUpdate(lastProps, lastState) {
    if (lastProps.currentFile !== this.props.currentFile) {
      this.setState({ currentFileValue: null })
      this.loadFile();
    }
  }

  loadFile() {
    if (!this.props.currentFile) return;

    // Get the current file to put in the ace editor
    FileAccessor.get(this.props.currentFile.filename, this.onCurrentFileLoaded, this.props.currentFile.type);
  }

  setupEditor() {
    // Set all editor related properties here.
    this.editor = ace.edit(this.refs.editor.getDOMNode());
    this.editor.setTheme('ace/theme/xcode');
    this.editor.renderer.setShowGutter(false);
    this.editor.renderer.setPadding(20);
    this.editor.renderer.setScrollMargin(20);
    this.editor.setShowPrintMargin(false);
    this.editor.setFontSize(14);
    this.editor.$blockScrolling = Infinity;
    this.editor.setHighlightActiveLine(false);
    this.editor.on("change", this.onEditorChanged)
  }

  // When someone changes the cursor, we need to tell the file that we have a changed cursor
  onCursorChanged() {
    if (!this.props.currentFile) return;

    let count = 0,
        position = this.editor.getCursorPosition(),
        i = 0,
        src = this.editor.getValue();

    while(count < position.row && (i = src.indexOf('\n', i) + 1)) { count++; }
    FileAccessor.setCursor(this.props.currentFile.filename, i);
  }

  // When the editor value changes, then we have to set our current state,
  // then update the file through the data store.
  onEditorChanged() {
    if (!this.props.currentFile) return;

    let value = this.editor.getValue();

    if (value === this.state.currentFileValue)
      return
    else {
      this.setState({ currentFileValue: value })
      FileAccessor.save(this.props.currentFile.filename, this.props.currentFile.type, value, this.props.onBookContentChanged);
    }
  }

  // After we load a file, set the value of the editor to it
  onCurrentFileLoaded(error, contents) {
    if (error)
      return console.error(error)
    else {
      // Set the value of it
      this.setState({ currentFileValue: contents }, this.setupCurrentFile);
    }
  }

  // Called when we load a new file.  Sets up the files editor session, and initial values.
  // TODO we should actually probably keep a set of edit sessions in our state, and then switch between them to keep the
  setupCurrentFile = () => {
    this.setupEditor();

    let newSession = new ace.EditSession(this.state.currentFileValue);
    // Add some session modes
    // TODO parse file type here and change mode and store session info
    newSession.setMode('ace/mode/markdown');
    newSession.setUseWrapMode(true);
    newSession.selection.on("changeCursor", this.onCursorChanged)
    newSession.setUndoManager(new ace.UndoManager());

    // Make the editor load this session
    this.editor.setSession(newSession)
    this.editor.focus()
  }

  renderEditor() {
    return (
      <section key={EDITOR_KEY} ref="editor" className="editor"></section>
    );
  }

  renderNoFileHelp() {
    return (
      <section className="editor nofile">
        <h3>No file selected.</h3>
        <p>Click one in the list on the left to start editing</p>
      </section>
    );
  }

  render() {
    return (
      this.props.currentFile ? this.renderEditor() : this.renderNoFileHelp()
    );
  }
}

Editor.propTypes = {
  currentFile: React.PropTypes.object,
  inLiveMode: React.PropTypes.bool.isRequired,
  onBookContentChanged: React.PropTypes.func.isRequired
}

export default Editor;
