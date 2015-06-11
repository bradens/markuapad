import React from "react";
import { fixImagePaths } from "../util"

class Preview extends React.Component {
  render() {
    let clazz = `preview ${this.props.previewState}`

    return (
      <section className={clazz}>
        <header className="container">
          <button className="close" onClick={this.props.onClosePreview}><i className="fa fa-times fa-2x"></i></button>
        </header>
        <section className="preloader"></section>
        <section className="previewWarnigs"></section>
        <section className="previewErrors">
          { this.props.previewErrors }
        </section>
        <div dangerouslySetInnerHTML={{ __html: fixImagePaths(this.props.html, this.forceUpdate.bind(this)) }} className="container content" />
      </section>
    );
  }
}

Preview.propTypes = {
  inLiveMode: React.PropTypes.bool.isRequired,
  onClosePreview: React.PropTypes.func.isRequired,
  html: React.PropTypes.string.isRequired,
  previewState: React.PropTypes.string.isRequired,
  previewErrors: React.PropTypes.string
}

export default Preview;