import React from 'react';
import FileAccessor from "../file_accessor"
import _ from 'underscore'

const delimeter = (type, filename) => {
  return `\n\n================================= ${type} version of ${filename} =================================\n\n`
}

class MergeConflictModal extends React.Component {
  static propTypes = {
    conflicts: React.PropTypes.array.isRequired,
    onClose: React.PropTypes.func.isRequired
  }

  state = {
    currentConflictIndex: 0
  }

  resolveConflict = (method) => {
    let conflict = this.props.conflicts[this.state.currentConflictIndex];

    switch (method) {
      case 'client':
        break;
      case 'server':
        // Save the file on the server.
        FileAccessor.save(conflict.filename, 'manuscript', conflict.serverVersion)
        break;
      case 'both':
        // Concat both versions separated by a delimeter
        FileAccessor.save(conflict.filename, 'manuscript', delimeter('Local', conflict.filename) +
          conflict.clientVersion +
          delimeter('Server', conflict.filename) +
          conflict.serverVersion)
        break;
    }

    if (this.state.currentConflictIndex + 1 >= this.props.conflicts.length) {
      // We are done.
      this.props.onClose()
    } else {
      // Increase the index
      this.setState({ currentConflictIndex: this.state.currentConflictIndex + 1 })
    }
  }

  renderCurrentConflict() {
    return (
      <div className="conflict-wrapper">
        <section className="conflict-content client-version">
          <h6>Your local copy</h6>
          <pre>
            { this.props.conflicts[this.state.currentConflictIndex].clientVersion }
          </pre>
        </section>
        <section className="conflict-content server-version">
          <h6>Server copy</h6>
          <pre>
            { this.props.conflicts[this.state.currentConflictIndex].serverVersion }
          </pre>
        </section>
      </div>
    );
  }

  render() {
    return (
      <div className="modal merge-conflicts-modal">
        <div className="modal-fade-screen">
          <div className="modal-inner">
            <div className="modal-close" onClick={ this.props.onClose }></div>
            <h4>Conflicting changes for { this.props.conflicts[this.state.currentConflictIndex].filename }</h4>
            <p className="conflict-explanation">
              Uh oh!  You have conflicting changes for { this.props.conflicts[this.state.currentConflictIndex].filename }. This
              probably happened because you were using the writing tools without
              an active internet connection. To resolve this, review the differences here, and select the option
              you want at the bottom. If you choose to 'keep both', then we will combine the two versions into one file so you
              can manually merge them.
            </p>
            { this.renderCurrentConflict() }
            <ul className="conflict-actions">
              <li>
                <a onClick={_.partial(this.resolveConflict, 'client')}>Keep local version</a>
              </li>
              <li>
                <a onClick={_.partial(this.resolveConflict, 'server')}>Keep remote version</a>
              </li>
              <li>
                <a onClick={_.partial(this.resolveConflict, 'both')}>Keep both versions</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default MergeConflictModal;