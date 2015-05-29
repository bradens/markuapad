import React from "react";

class Toolbar extends React.Component {
  renderFileBrowserToggle() {
    if (this.props.filesOpen)
      return <li><a><i className="fa fa-list"></i> Hide File Browser</a></li>
    else
      return <li><a><i className="fa fa-list"></i> Show File Browser</a></li>
  }

  render() {
    // <li><a onClick={this.onClick}>File</a></li>
    // <li><a onClick={this.onClick}>Edit</a></li>
    // <li><a onClick={this.onClick}>Format</a></li>
    // <li><a onClick={this.onClick}>Help</a></li>
    return (
      <nav className="toolbar">
        <h3 className="book-title">{ this.props.bookTitle}</h3>
        <ul className="menus">
          <li className="dropdown">
            <a>File</a>
            <div className="dropdown-menu">
              <ul>
                <li><a><i className="fa fa-plus"></i> New</a></li>
                { this.renderFileBrowserToggle() }
              </ul>
            </div>
          </li>
        </ul>
        <ul className="actions">
          <li><a onClick={this.props.onGeneratePreview}><i className="fa fa-file-text"></i> Preview</a></li>
        </ul>
      </nav>
    );
  }
}

export default Toolbar;