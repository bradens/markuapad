import React from "react";

class FileBrowserListItem extends React.Component {
  render() {
    return (
      <li className="files-list-item">
        { this.props.file.name }
      </li>
    );
  }
}

FileBrowserListItem.propTypes = { file: React.PropTypes.object.isRequired }

export default FileBrowserListItem;