import React from "react";
import Actions from '../actions/actions';

let PROGRESS_TYPE_MAP = {
  'manuscript_update': 'Manuscript Updated.',
  'file_save': 'Saved.',
  'image_create': 'Image Created.',
  'file_delete': 'File Deleted'
}

class Toolbar extends React.Component {
  state = {
    flash: null
  }

  constructor(props) {
    super(props)

    // Listen to the flash action
    this.unsub = Actions.flash.listen((type, message) => {
      // Clear any existing timers
      clearInterval(this.timer)

      // Set the flash message
      this.setState({ flash: { type: type, message: message } })

      // Set up the timer to clear the flash message
      this.timer = setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    })
  }

  render() {
    return (
      <nav className="toolbar">
        <h3 className="book-title">{ this.props.bookTitle}</h3>
        <ul className="actions">
          <li>
            <a className={`progressMessage ${this.props.inProgress ? 'active' : ''}`}>
              { this.props.inProgress ? <i className="fa fa-refresh fa-spin"></i> : null } { PROGRESS_TYPE_MAP[this.props.progressType] || 'Working...' }
            </a>
          </li>
          {
            this.state.flash ?
              <li onClick={() => this.setState({ flash: null })} key={this.state.flash.type}>
                <a className={`${this.state.flash.type}`}>{ this.state.flash.message }</a>
              </li>
            : null
          }
          {
            this.props.enablePreview  ?
              [
                <li key="toggleLive"><a className={this.props.inLiveMode ? 'active' : '' } onClick={this.props.toggleLiveMode}><i className="fa fa-columns"></i> Live Mode</a></li>,
                <li key="preview"><a className={this.props.inLiveMode ? 'disabled' : '' } onClick={this.props.onGeneratePreview}><i className="fa fa-play"></i> Preview</a></li>
              ]
            : null
          }
        </ul>
      </nav>
    );
  }
}

Toolbar.propTypes = {
  enablePreview: React.PropTypes.bool.isRequired,
  inProgress: React.PropTypes.bool.isRequired,
  progressType: React.PropTypes.string,
  inLiveMode: React.PropTypes.bool.isRequired,
  toggleLiveMode: React.PropTypes.func.isRequired,
  onGeneratePreview: React.PropTypes.func.isRequired,
  bookTitle: React.PropTypes.string.isRequired
}

export default Toolbar;