import React from "react";

class Preview extends React.Component {
  render() {
    let clazz = `preview ${this.props.previewState}`

    return (
      <section className={clazz}>
        <header className="container">
          <button className="close" onClick={this.props.onClosePreview}><i className="fa fa-times"></i></button>
        </header>
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

export default Preview;