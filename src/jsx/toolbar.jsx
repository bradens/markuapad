import React from "react";

class Toolbar extends React.Component {
  render() {
    if (this.props.enablePreview) {
      return (
        <nav className="toolbar">
          <h3 className="book-title">{ this.props.bookTitle}</h3>
          <ul className="actions">
            <li><a className={this.props.inLiveMode ? 'active' : '' } onClick={this.props.toggleLiveMode}><i className="fa fa-columns"></i> Live Mode</a></li>
            <li><a className={this.props.inLiveMode ? 'disabled' : ''} onClick={this.props.onGeneratePreview}><i className="fa fa-play"></i> Preview</a></li>
          </ul>
        </nav>
      );
    } else {
      return (
        <span />
      );
    }
  }
}

Toolbar.propTypes = {
  enablePreview: React.PropTypes.bool.isRequired,
  inLiveMode: React.PropTypes.bool.isRequired,
  toggleLiveMode: React.PropTypes.func.isRequired,
  onGeneratePreview: React.PropTypes.func.isRequired,
  bookTitle: React.PropTypes.string.isRequired
}

export default Toolbar;