import React from "react";
import { DragSource, DropTarget } from 'react-dnd';

const fileSource = {
  beginDrag(props) {
    // Return the data describing the dragged item
    return props.file
  }
}

const fileTarget = {
  hover(props, monitor) {
    const draggedFile = monitor.getItem()

    if (draggedFile !== props.file)
      props.moveFile(draggedFile, props.file)
  },

  drop(props, monitor) {
    props.saveManuscript()
  }
}

@DropTarget('file', fileTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource('file', fileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class FileBrowserListItem {
  constructor(props) {
    this.onDelete = this.onDelete.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onDelete(e) {
    if (confirm("Are you sure you want to delete this file?"))
      this.props.onDeleteFile(this.props.file)

    e.stopPropagation();
    e.preventDefault();
  }

  onChange(e) {
    this.props.onChangeFile(this.props.file)
  }

  getFileIconClass() {
    switch (this.props.fileMode) {
      case 'manuscript':
        return 'fa-file-o';
      case 'images':
        return 'fa-file-image';
      case 'code':
        return 'fa-code';
    }
  }

  render() {
    let clazz = `files-list-item${this.props.isCurrent ? ' current' : ''}${this.props.file.parent ? ' child' : ''}${this.props.isDragging ? ' dragging' : ''}`

    return this.props.connectDragSource(this.props.connectDropTarget(
      <li className={clazz} onClick={this.onChange}>
        <a>
          <i className={`fa ${this.getFileIconClass()}`}></i> { this.props.file.filename }
        </a>
        <button onClick={this.onDelete}><i className="fa fa-times"></i></button>
      </li>
    ));
  }
}

FileBrowserListItem.propTypes = {
  file: React.PropTypes.object.isRequired,
  fileMode: React.PropTypes.string.isRequired,
  moveFile: React.PropTypes.func.isRequired,
  saveManuscript: React.PropTypes.func.isRequired,
  isCurrent: React.PropTypes.bool.isRequired,
  onDeleteFile: React.PropTypes.func.isRequired,
  onChangeFile: React.PropTypes.func.isRequired
}