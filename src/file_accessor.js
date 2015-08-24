class FileAccessor {
  constructor() {
    // This is the way that the implementer has given us to access files
    this.fileAccessorDelegate = null;
  }

  get() {
    this.fileAccessorDelegate.get(...arguments);
  }

  getSync() {
    return this.fileAccessorDelegate.getSync(...arguments);
  }

  listFiles() {
    this.fileAccessorDelegate.listFiles(...arguments);
  }

  listImages() {
    this.fileAccessorDelegate.listImages(...arguments);
  }

  listCode() {
    this.fileAccessorDelegate.listCode(...arguments);
  }

  save() {
    this.fileAccessorDelegate.save(...arguments);
  }

  saveManuscript() {
    this.fileAccessorDelegate.saveManuscript(...arguments);
  }

  newImage() {
    this.fileAccessorDelegate.newImage(...arguments);
  }

  new() {
    this.fileAccessorDelegate.new(...arguments);
  }

  delete() {
    this.fileAccessorDelegate.delete(...arguments);
  }

  isSetup() {
    this.fileAccessorDelegate !== null;
  }

  setup(fileAccessor, projectRoot) {
    this.fileAccessorDelegate = new fileAccessor(projectRoot);
  }

  setCursor() {
    this.fileAccessorDelegate.setCursor(...arguments);
  }

  // Events
  onDelete() {
    this.fileAccessorDelegate.onDelete(...arguments);
  }

  onManuscriptChange() {
    this.fileAccessorDelegate.onManuscriptChange(...arguments);
  }

  onAdd() {
    this.fileAccessorDelegate.onAdd(...arguments);
  }

  onProgress() {
    this.fileAccessorDelegate.onProgress(...arguments);
  }

  onProgressStarted() {
    this.fileAccessorDelegate.onProgressStarted(...arguments);
  }

  supportsImageUploads() {
    return this.fileAccessorDelegate.supportsImageUploads;
  }

  onMergeConflicts() {
    return this.fileAccessorDelegate.onMergeConflicts(...arguments);
  }
}

export default new FileAccessor();