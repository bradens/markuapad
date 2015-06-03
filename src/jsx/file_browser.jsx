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
      fileMode: 'files'
    };

    // Autobind
    this.toggleClose = this.toggleClose.bind(this);
    this.newFile = this.newFile.bind(this);
    this.createFile = this.createFile.bind(this);
    this.listFiles = this.listFiles.bind(this);
    this.onDeleteFile = this.onDeleteFile.bind(this);
    this.onChangeMode = this.onChangeMode.bind(this);
  }

  componentDidMount() {
    this.listFiles();
  }

  componentDidUpdate(lastProps, lastState) {
    if (lastState.fileMode && lastState.fileMode !== this.state.fileMode) {
      this[`list${_.string.capitalize(this.state.fileMode)}`]()
    }
  }

  // List what files we have
  listFiles() {
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
    FileAccessor.new(fileNode.value, "manuscript", '', () => {
      fileNode.value = '';
      this.setState({ creatingFile: false });
      this.listFiles();
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
    FileAccessor.delete(file.filename, "manuscript", this.listFiles);
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
          <li><a onClick={_.partial(this.onChangeMode, 'files')}><h4 className={`title${this.state.fileMode === 'files' ? ' selected' : ''}`}>files</h4></a></li>
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