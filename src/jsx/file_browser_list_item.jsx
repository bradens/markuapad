import React from "react";

class FileBrowserListItem extends React.Component {
  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
    this.onChange = this.onChange.bind(this);
    this.renderType = this.renderType.bind(this);
  }

  onDelete(e) {
    if (confirm("Are you sure you want to delete this file?"))
      this.props.onDeleteFile(this.props.file)

    e.stopPropagation();
    e.preventDefault();
  }

  onChange(e) {
    if (this.props.file.type === "folder")
      return

    this.props.onChangeFile(this.props.file)
  }

  renderType() {
    let iconClass = '';
    switch (this.props.file.type) {
      case 'text':
        iconClass = "fa-file-text";
        break;
      case 'folder':
        iconClass = "fa-folder-open";
        break;
      case 'image':
        iconClass = "fa-file-image-o";
        break;
      case 'code':
        iconClass = "fa-code";
        break
    }

    return (<i className={`fa ${iconClass}`}></i>);
  }

  render() {
    let clazz = `files-list-item${this.props.isCurrent ? ' current' : ''}${this.props.file.parent ? ' child' : ''}`

    return (
      <li className={clazz} onClick={this.onChange}>
        <a>
          { this.renderType() } { this.props.file.path.substr(this.props.file.path.lastIndexOf("/") + 1) }
        </a>
        { this.props.file.type !== "folder" ? <button onClick={this.onDelete}><i className="fa fa-times"></i></button> : null }
      </li>
    );
  }
}

FileBrowserListItem.propTypes = {
  file: React.PropTypes.object.isRequired,
  isCurrent: React.PropTypes.bool.isRequired,
  onDeleteFile: React.PropTypes.func.isRequired,
  onChangeFile: React.PropTypes.func.isRequired
}

export default FileBrowserListItem;