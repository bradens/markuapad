import React from "react";

class LivePreview extends React.Component {
  render() {
    return (
      <section className={`live-preview ${this.props.previewState}`}>
        <section className="preloader"></section>
        <section className="previewWarnigs"></section>
        <section className="previewErrors">
          { this.props.previewErrors }
        </section>
        <div dangerouslySetInnerHTML={{ __html: this.props.html }} className="container content" />
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