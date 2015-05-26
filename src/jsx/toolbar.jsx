import React from "react";

class Toolbar extends React.Component {
  onClick(e) {
    console.log("Clicking");
  }

  render() {
    return (
      <nav className="toolbar">
        <ul>
          <li><a onClick={this.onClick}>File</a></li>
          <li><a onClick={this.onClick}>Edit</a></li>
          <li><a onClick={this.onClick}>Format</a></li>
          <li><a onClick={this.onClick}>Preview</a></li>
          <li><a onClick={this.onClick}>Help</a></li>
        </ul>
      </nav>
    );
  }
}

export default Toolbar;