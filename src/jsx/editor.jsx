import React from "react";
import ace from "brace";
import javascript from "brace/mode/markdown";
import monokai from "brace/theme/xcode";
import emacsKeys from "brace/keybinding/emacs"

class Editor extends React.Component {
  componentDidMount() {
    this.editor = ace.edit(this.refs.editor.getDOMNode());
    this.editor.getSession().setMode('ace/mode/markdown');
    this.editor.setTheme('ace/theme/xcode');
    this.editor.setKeyboardHandler('ace/keyboard/emacs');
    this.editor.renderer.setShowGutter(false);
    this.editor.renderer.setPadding(20);
    this.editor.renderer.setScrollMargin(20);
    this.editor.setShowPrintMargin(false);
    this.editor.setFontSize(14);
    this.editor.setKey
  }

  render() {
    return (
      <section ref="editor" className="editor">
      </section>
    );
  }
}

export default Editor;