import React from "react";
import _ from "underscore";
import FileBrowserListItem from "./file_browser_list_item";

class FileBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [{ name: "book.txt", contents: "test one linteaosuoae"}],
      closed: false
    };

    this.toggleClose = this.toggleClose.bind(this);
  }

  toggleClose(e) {
    this.setState({ closed: !this.state.closed });
  }

  render() {
    let clazz = `file-browser ${this.state.closed ? "closed" : "open"}`
    return (
      <section className={clazz}>
        <ul className="files-list">
          { _.map(this.state.files, function(file) { return <FileBrowserListItem file={file} /> }) }
        </ul>
        <button className="close-button" onClick={this.toggleClose}><span></span></button>
      </section>
    );
  }
}

export default FileBrowser;