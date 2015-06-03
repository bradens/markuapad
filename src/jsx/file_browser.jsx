import React from "react";
import _ from "underscore";
import FileBrowserListItem from "./file_browser_list_item";
import FileAccessor from "../file_accessor";

class FileBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      closed: false
    };

    // Autobind
    this.toggleClose = this.toggleClose.bind(this);
    this.newFile = this.newFile.bind(this);
    this.createFile = this.createFile.bind(this);
    this.listFiles = this.listFiles.bind(this);
    this.onDeleteFile = this.onDeleteFile.bind(this);
  }

  componentDidMount() {
    this.listFiles()
  }

  // List what files we have
  listFiles() {
    FileAccessor.list((error, files) => {
      if (error)
        console.error(error);
      else {
        // Group the files by their parent
        let groups = _.groupBy(files, (file) => {
          return file.parent;
        });

        // Now sort them
        files = _.flatten(_.map(groups, (fileGroup, parent) => {
          if (parent !== "undefined")
            return [_.findWhere(files, { path: parent })].concat(fileGroup);
          else
            return _.reject(fileGroup, (f) => { return f.type === "folder"; });
        }));

        this.setState({ files: files });
      }
    });
  }

  toggleClose(e) {
    this.setState({ closed: !this.state.closed });
  }

  // Actually create a new file
  createFile(e) {
    let fileNode = this.refs.filename.getDOMNode()
    FileAccessor.new(`${this.props.projectRoot}/${fileNode.value}`, "text", '', () => {
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
    FileAccessor.delete(file.path, this.listFiles);
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
        <h4 className="title">files</h4>
        <div className={newFileClassName} onClick={this.newFile}>
          <i className="fa fa-plus"> </i>
        </div>
        { this.renderFileCreator() }
        <ul className="files-list">
          { _.map(this.state.files, (file, i) => { return <FileBrowserListItem key={i} onDeleteFile={this.onDeleteFile} onChangeFile={this.props.onChangeFile} isCurrent={this.props.currentFile === file} file={file} /> }) }
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