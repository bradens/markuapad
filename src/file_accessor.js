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

  list() {
    this.fileAccessorDelegate.list(...arguments);
  }

  save() {
    this.fileAccessorDelegate.save(...arguments);
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
}

export default new FileAccessor();