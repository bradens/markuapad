import React from "react";
import _ from "underscore";
import FileBrowserListItem from "./file_browser_list_item";
import FileAccessor from "../file_accessor";
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import { DragDropContext } from 'react-dnd';

import _string from "underscore.string";
_.string = _string;

class FileBrowser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      closed: false,
      fileMode: 'manuscript',
      busy: false
    };

    // Autobind
    this.toggleClose = this.toggleClose.bind(this);
    this.newFile = this.newFile.bind(this);
    this.createFile = this.createFile.bind(this);
    this.listManuscript = this.listManuscript.bind(this);
    this.onDeleteFile = this.onDeleteFile.bind(this);
    this.onChangeMode = this.onChangeMode.bind(this);
    this.onFileDeleted = this.onFileDeleted.bind(this);
    this.listCode = this.listCode.bind(this);
    this.listManuscript = this.listManuscript.bind(this);
    this.listImages = this.listImages.bind(this);
    this.moveFile = this.moveFile.bind(this);
    this.saveManuscript = this.saveManuscript.bind(this);

    FileAccessor.onDelete(this.onFileDeleted);
  }

  componentDidMount() {
    this.listManuscript();
  }

  componentDidUpdate(lastProps, lastState) {
    if (lastState.fileMode && lastState.fileMode !== this.state.fileMode) {
      this[`list${_.string.capitalize(this.state.fileMode)}`]()
    }
  }

  // We need to rechoose an appropriate file
  onFileDeleted() {
    this.props.onChangeFile(this.state.files[0])
  }

  // List what files we have
  listManuscript() {
    this.busy(true);
    FileAccessor.listFiles((error, files) => {
      this.busy(false);
      if (error)
        console.error(error);
      else {
        this.setState({ files: files });
      }
    });
  }

  // List what files we have
  listImages() {
    this.busy(true);
    FileAccessor.listImages((error, files) => {
      this.busy(false);
      if (error)
        console.error(error);
      else {
        this.setState({ files: files });
      }
    });
  }

  // List what files we have
  listCode() {
    this.busy(true);
    FileAccessor.listCode((error, files) => {
      this.busy(false);
      if (error)
        console.error(error);
      else {
        this.setState({ files: files });
      }
    });
  }

  busy(busyState) {
    this.setState({ busy: busyState });
  }

  free() {
    this.setState({ busy: false });
  }

  toggleClose(e) {
    this.setState({ closed: !this.state.closed });
  }

  onChangeMode(fileMode) {
    this.setState({ fileMode: fileMode });
  }

  // Actually create a new file
  createFile(e) {
    let fileNode = this.refs.filename.getDOMNode()
    FileAccessor.new(fileNode.value, this.state.fileMode, '', () => {
      fileNode.value = '';
      this.setState({ creatingFile: false });
      this[`list${_.string.capitalize(this.state.fileMode)}`]()
    });

    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  // Open the new file form
  newFile(e) {
    this.setState({ creatingFile: !this.state.creatingFile })
  }

  // Delete a file
  onDeleteFile(file) {
    FileAccessor.delete(file.filename, this.state.fileMode, this[`list${_.string.capitalize(this.state.fileMode)}`]);
  }

  saveManuscript() {
    if (this.state.fileMode !== "manuscript") return;

    FileAccessor.saveManuscript(this.state.files);
  }

  // Reorder a file in the list
  moveFile(draggedItem, targetItem) {
    let files = _.clone(this.state.files)

    let draggedItemIndex = files.indexOf(draggedItem)
    let targetItemIndex = files.indexOf(targetItem)


    files.splice(draggedItemIndex, 1);
    files.splice(targetItemIndex, 0, draggedItem);
    this.setState({ files: files });
  }

  renderFileCreator() {
    if (!this.state.creatingFile) return;

    return (
      <form onSubmit={this.createFile} className="file-name">
        <input type="text" ref="filename" placeholder="Type a filename..."></input>
        <button>Create</button>
      </form>
    );
  }

  renderFilesList() {
    if (this.state.busy)
      return <i className="busy-indicator fa fa-spin fa-2x fa-circle-o-notch"></i>;
    else {
      return (
        <ul className="files-list">
          {
            _.map(this.state.files, (file, i) => {
              return (
                <FileBrowserListItem
                  saveManuscript={this.saveManuscript}
                  moveFile={this.moveFile}
                  key={i}
                  fileMode={this.state.fileMode}
                  onDeleteFile={this.onDeleteFile}
                  onChangeFile={this.props.onChangeFile}
                  isCurrent={this.props.currentFile === file}
                  file={file} />
              )
            })
          }
        </ul>
      )
    }
  }

  render() {
    let clazz = `file-browser ${this.state.closed ? "closed" : "open"}`
    let newFileClassName = `new-file${ this.state.creatingFile ? " active" : ""}`;
    return (
      <section className={clazz}>
        <ul className="file-types-list">
          <li><a onClick={_.partial(this.onChangeMode, 'manuscript')}><h4 className={`title${this.state.fileMode === 'manuscript' ? ' selected' : ''}`}>files</h4></a></li>
          <li><a onClick={_.partial(this.onChangeMode, 'images')}><h4 className={`title${this.state.fileMode === 'images' ? ' selected' : ''}`}>images</h4></a></li>
          <li><a onClick={_.partial(this.onChangeMode, 'code')}><h4 className={`title${this.state.fileMode === 'code' ? ' selected' : ''}`}>code</h4></a></li>
        </ul>
        <div className={newFileClassName} onClick={this.newFile}>
          <i className="fa fa-plus"> </i>
        </div>
        { this.renderFileCreator() }
        { this.renderFilesList() }
        <button className="close-button" onClick={this.toggleClose}><span></span></button>
      </section>
    );
  }
}

FileBrowser.propTypes = {
  projectRoot: React.PropTypes.string.isRequired,
  onChangeFile: React.PropTypes.func.isRequired,
  currentFile: React.PropTypes.string.isRequired
};

export default DragDropContext(HTML5Backend)(FileBrowser);