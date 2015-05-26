import React from "react";

class FileBrowserListItem extends React.Component {
  render() {
    return (
      <li className="files-list-item">
        <a>{ this.props.file.name }</a>
      </li>
    );
  }
}

FileBrowserListItem.propTypes = { file: React.PropTypes.object.isRequired }

export default FileBrowserListItem;