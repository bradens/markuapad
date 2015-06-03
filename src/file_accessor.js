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

  // Events
  onDelete() {
    this.fileAccessorDelegate.onDelete(...arguments);
  }

  onAdd() {
    this.fileAccessorDelegate.onAdd(...arguments);
  }
}

export default new FileAccessor();