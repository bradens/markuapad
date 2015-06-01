import React from "react";

class FileBrowserListItem extends React.Component {
  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onDelete(e) {
    if (confirm("Are you sure you want to delete this file?"))
      this.props.onDeleteFile(this.props.file)

    e.stopImmediatePropagation()
  }

  onChange(e) {
    this.props.onChangeFile(this.props.file)
  }

  render() {
    let clazz = `files-list-item${this.props.isCurrent ? ' current' : ''}`
    return (
      <li className={clazz} onClick={this.onChange}>
        <a>{ this.props.file }</a>
        <button onClick={this.onDelete}><i className="fa fa-times"></i></button>
      </li>
    );
  }
}

FileBrowserListItem.propTypes = {
  file: React.PropTypes.string.isRequired,
  isCurrent: React.PropTypes.bool.isRequired,
  onDeleteFile: React.PropTypes.func.isRequired,
  onChangeFile: React.PropTypes.func.isRequired
}

export default FileBrowserListItem;