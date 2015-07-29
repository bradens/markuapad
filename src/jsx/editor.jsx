import React from "react";
import ace from "brace";
import javascript from "brace/mode/markdown";
import monokai from "brace/theme/xcode";
import emacsKeys from "brace/keybinding/emacs"
import FileAccessor from "../file_accessor";
import _ from "underscore";

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
    this.setupEditor();
  }

  // If we get a file change from outside our domain, switch to it.
  // TODO: maybe show a merge warning or something?
  componentDidUpdate(lastProps, lastState) {
    if (lastProps.currentFile !== this.props.currentFile) {
      this.setupEditor();
    }
  }

  setupEditor() {
    if (!this.props.currentFile) return;

    // Setup the ace editor
    this.editor = ace.edit(this.refs.editor.getDOMNode());
    this.editor.getSession().setMode('ace/mode/markdown');
    this.editor.setTheme('ace/theme/xcode');
    this.editor.setKeyboardHandler('ace/keyboard/emacs');
    this.editor.renderer.setShowGutter(false);
    this.editor.renderer.setPadding(20);
    this.editor.renderer.setScrollMargin(20);
    this.editor.setShowPrintMargin(false);
    this.editor.setFontSize(14);
    this.editor.$blockScrolling = Infinity;
    this.editor.session.setUseWrapMode(true);
    this.editor.setHighlightActiveLine(false);

    // When the editor changes, alert us
    this.editor.on("change", this.onEditorChanged)
    this.editor.getSession().selection.on("changeCursor", this.onCursorChanged)

    // Get the current file to put in the ace editor
    FileAccessor.get(this.props.currentFile.filename, this.onCurrentFileLoaded, this.props.currentFile.type);
  }

  // When someone changes the cursor, we need to tell the file that we have a changed cursor
  onCursorChanged() {
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
      // Focus the editor
      this.editor.focus;

      // Set the value of it
      this.setState({ currentFileValue: contents }, () => this.editor.setValue(contents, -1));
    }
  }

  renderEditor() {
    return (
      <section ref="editor" className="editor"></section>
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