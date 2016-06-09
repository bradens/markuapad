import React from "react";
import FileAccessor from "../file_accessor"

class ImageModal extends React.Component {

  componentDidMount() {
    this.grabImageData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.file !== this.props.file) this.grabImageData();
  }

  grabImageData() {
    FileAccessor.get(this.props.file.filename, this.forceUpdate.bind(this), "image");
  }

  getSelectedImageDataURI() {
    let imageFile = FileAccessor.getSync(this.props.file.filename, "image")

    if (!imageFile)
      return null

    if (imageFile.data)
      return `data:${imageFile.mimetype.string};base64,${imageFile.data}`
    else if (imageFile.url)
      return imageFile.url
    else
      return null
  }

  render() {
    return (
      <div className="modal">
        <div className="modal-fade-screen">
          <div className="modal-inner">
            <div className="modal-close" onClick={ this.props.onClose }></div>
            <h1>{ this.props.file.filename }</h1>
            <div className="modal-content">
              <img src={ this.getSelectedImageDataURI() } />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ImageModal.propTypes = {
  file: React.PropTypes.object.isRequired,
  onClose: React.PropTypes.func.isRequired
}

export default ImageModal;
