import React from "react";
import { fixImagePaths } from "../util"

class LivePreview extends React.Component {
  render() {
    return (
      <section className={`live-preview ${this.props.previewState}`}>
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

LivePreview.propTypes = {
  html: React.PropTypes.string.isRequired,
  previewState: React.PropTypes.string.isRequired,
  previewErrors: React.PropTypes.string
}

export default LivePreview;