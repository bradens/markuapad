import React from "react";
import _ from "underscore";
import FileBrowserListItem from "./file_browser_list_item";
import FileAccessor from "../file_accessor";
import _string from "underscore.string";
_.string = _string;

class FileBrowser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      closed: false,
      fileMode: 'manuscript'
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
    FileAccessor.listFiles((error, files) => {
      if (error)
        console.error(error);
      else {
        this.setState({ files: files });
      }
    });
  }

  // List what files we have
  listImages() {
    FileAccessor.listImages((error, files) => {
      if (error)
        console.error(error);
      else {
        this.setState({ files: files });
      }
    });
  }

  // List what files we have
  listCode() {
    FileAccessor.listCode((error, files) => {
      if (error)
        console.error(error);
      else {
        this.setState({ files: files });
      }
    });
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

  renderFileCreator() {
    if (!this.state.creatingFile) return;

    return (
      <form onSubmit={this.createFile} className="file-name">
        <input type="text" ref="filename" placeholder="Type a filename..."></input>
        <button>Create</button>
      </form>
    );
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
        <ul className="files-list">
          {
            _.map(this.state.files, (file, i) => {
              return (
                <FileBrowserListItem
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

export default FileBrowser;