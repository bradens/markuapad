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
    this.onEditorChanged = _.debounce(this.onEditorChanged.bind(this), 200);
  }

  // Setup all the editor options when we mount.
  componentDidMount() {
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

    // Get the current file to put in the ace editor
    FileAccessor.get(this.props.currentFile, this.onCurrentFileLoaded);
  }

  // If we get a file change from outside our domain, switch to it.
  // TODO: maybe show a merge warning or something?
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentFile !== this.props.currentFile) {
      FileAccessor.get(nextProps.currentFile, this.onCurrentFileLoaded);
    }
  }

  // When the editor value changes, then we have to set our current state,
  // then update the file through the data store.
  onEditorChanged() {
    let value = this.editor.getValue();

    if (value === this.state.currentFileValue)
      return
    else {
      this.setState({ currentFileValue: value })
      FileAccessor.save(this.props.currentFile, value, () => {
        console.log("Saved file");
      });

      // Notify the parent
      this.props.onBookContentChanged();
    }
  }

  // After we load a file, set the value of the editor to it
  onCurrentFileLoaded(error, contents) {
    if (error)
      console.error(error)
    else {
      this.setState({ currentFileValue: contents }, () => this.editor.setValue(contents, -1));
    }
  }

  render() {
    return (
      <section ref="editor" className="editor"></section>
    );
  }
}

Editor.propTypes = {
  currentFile: React.PropTypes.string.isRequired,
  inLiveMode: React.PropTypes.bool.isRequired,
  onBookContentChanged: React.PropTypes.func.isRequired
}

export default Editor;