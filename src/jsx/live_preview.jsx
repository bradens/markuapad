import React from "react";
import { fixImagePaths } from "../util"
import { default as $ } from "jquery"

class LivePreview extends React.Component {
  componentDidUpdate(lastProps, lastState) {
    if (this.props.previewState !== lastProps.previewState) {
      let cursor = $("[data-markua-cursor-position='__markuaCursorPosition__']").get(0)
      if (cursor)
        $(React.findDOMNode(this)).animate({
          scrollTop: cursor.offsetTop - 100
        }, 200);
    }
  }

  render() {
    return (
      <section className={`live-preview ${this.props.previewState}`}>
        <section className="preloader"></section>
        <section className="previewWarnigs"></section>
        <section className="previewErrors">
          { this.props.previewErrors }
        </section>
        <div ref="content" dangerouslySetInnerHTML={{ __html: fixImagePaths(this.props.html, this.forceUpdate.bind(this)) }} className="container content" />
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