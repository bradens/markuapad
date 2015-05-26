import React from "react";
import _ from "underscore";
import FileBrowserListItem from "./file_browser_list_item";

class FileBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = { files: [{ name: "book.txt", contents: "test one linteaosuoae"}] };
  }

  render() {
    return (
      <section className="file-browser">
        <ul className="files-list">
          { _.map(this.state.files, function(file) { return <FileBrowserListItem file={file} /> }) }
        </ul>
      </section>
    );
  }
}

export default FileBrowser;