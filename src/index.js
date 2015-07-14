require("./styles/index.scss");

import { setCached, getCached } from "./util"

let _ = require("underscore");

let noop = () => {};

let INITIAL_FILES = [
  { filename: "my-first-markuapad-book/book.txt", content: "chapter1.txt\nchapter2.txt" },
  { filename: "my-first-markuapad-book/manifest_files/chapter1.txt", in_sample: false, content: "#Chapter 1\n\nHere is the first chapter" },
  { filename: "my-first-markuapad-book/manifest_files/chapter2.txt", in_sample: false, content: "#Chapter 2\n\nHere is the second chapter" },
  { filename: "my-first-markuapad-book/manifest_code/sample.js", content: "function() {\n  console.log('Hello, World!');\n}\n" }
]

let MANIFEST_FILES = [
  { filename: "my-first-markuapad-book/manifest_files", files: [{ filename: "chapter1.txt" }, { filename: "chapter2.txt" }]},
  { filename: "my-first-markuapad-book/manifest_code", files: [{ filename: "sample.js" }]},
  { filename: "my-first-markuapad-book/manifest_images", files: []}
]

// Create our client side files for markuapad to work with.
if (!getCached("my-first-markuapad-book/manifest_files")) {
  for (let file of INITIAL_FILES) {
    let initialFilename = file.filename
    file.filename = file.filename.substr(file.filename.lastIndexOf("/") + 1)
    setCached(initialFilename, file);
  }

  for (let file of MANIFEST_FILES) {
    setCached(file.filename, file.files);
  }
}

// This is the file accessor that you must implement before creating a new markuapad instance.
// All I/O operations go through this.
// This implementation is for use in the browser, and is only for demo purposes, so we use
// localstorage as the data store.
// Since this is as client side data store implementation
class ExampleFileAccessor {
  constructor(projectRoot) {
    this.projectRoot = projectRoot
    this.onAddCallbacks = [];
    this.onDeleteCallbacks = [];
    this.onManuscriptChangeCallbacks = [];
    this.manifestFilesKey = `${this.projectRoot}/manifest_files`;
    this.manifestCodeKey = `${this.projectRoot}/manifest_code`;
    this.manifestImagesKey = `${this.projectRoot}/manifest_images`;
    this.supportsImageUploads = true;
  }

  getFilePrefix(type) {
    if (type === "manuscript")
      return this.manifestFilesKey;
    else if (type === "code")
      return this.manifestCodeKey;
    else if (type === "image")
      return this.manifestImagesKey;
    else
      return this.projectRoot;
  }

  get(path, cb = noop, type = "manuscript") {
    let file = getCached(`${this.getFilePrefix(type)}/${path}`);
    cb(null, file && file.content);
  }

  getSync(path, type = "manuscript") {
    let file = getCached(`${this.getFilePrefix(type)}/${path}`);
    return file && file.content;
  }

  listFiles(cb = noop) {
    let files = _.map(getCached(this.manifestFilesKey), (f) => { return _.extend(f, { type: "manuscript" }); });
    cb(null, files);
  }

  listImages(cb = noop) {
    let files = _.map(getCached(this.manifestImagesKey), (f) => { return _.extend(f, { type: "image" }); });
    cb(null, files ? _.map(files, function(file) { return _.omit(file, "content"); }) : []);
  }

  listCode(cb = noop) {
    let files = _.map(getCached(this.manifestCodeKey), (f) => { return _.extend(f, { type: "code" }); });
    cb(null, files ? _.map(files, function(file) { return _.omit(file, "content"); }) : []);
  }

  save(filename, type = "manuscript", content = "", cb = noop) {
    // Do we want a code sample or manuscript file
    let filePath = `${this.getFilePrefix(type)}/${filename}`;

    // Get the current version
    let file = getCached(filePath);
    file.content = content;

    setCached(filePath, file);
    cb(null);
  }

  saveManuscript(files, cb = noop) {
    setCached(this.manifestFilesKey, files);
    setCached(`${this.projectRoot}/book.txt`, { filename: "book.txt", content: _.map(files, (f) => { return f.filename }).join("\n") })

    // Fire stored callbacks
    for (let callback of this.onManuscriptChangeCallbacks)
      callback(null);

    cb(null);
  }

  newImage(fileNode, cb = noop) {
    cb("Images uploads don't work on markuapad.com")
  }

  new(filename, type = "manuscript", content = "", cb = noop) {
    let file = { filename: filename, content: content, type: type }
    let filePath = `${this.getFilePrefix(type)}/${filename}`;
    let manifestKey = type === "manuscript" ? this.manifestFilesKey : this.manifestCodeKey
    let manifestFiles = getCached(manifestKey).concat([_.omit(file, "content")]);

    setCached(filePath, file);
    setCached(manifestKey, manifestFiles);

    // when updating manuscript, make sure to update the book.txt
    if (type === "manuscript") setCached(`${this.projectRoot}/book.txt`, { filename: "book.txt", content: _.map(manifestFiles, (f) => { return f.filename }).join("\n")});

    cb(null, file);

    // Fire stored callbacks
    for (let callback of this.onAddCallbacks)
      callback(file);
  }

  delete(filename, type = "manuscript", cb = noop) {
    let manifestKey;
    if (type === "manuscript")
      manifestKey = this.manifestFilesKey
    else if (type === "image")
      manifestKey = this.manifestImagesKey
    else
      manifestKey = this.manifestCodeKey

    let files = getCached(manifestKey);
    let filePath = `${this.getFilePrefix(type)}/${filename}`;

    // Remove the file
    localStorage.removeItem(filePath);

    // Update file list
    files = _.reject(files, (file) => { return file.filename === filename; });
    setCached(manifestKey, files)

    if (type === "manuscript") setCached(`${this.projectRoot}/book.txt`, { filename: "book.txt", content: _.map(files, (f) => { return f.filename }).join("\n") })

    // Call the given callback
    cb(null);

    // Fire stored callbacks
    for (let callback of this.onDeleteCallbacks)
      callback(filename);
  }

  setCursor(file, position) {
    setCached("markuapad_cursor", { filename: file, position: position })
  }

  onAdd(cb = noop) {
    this.onAddCallbacks.push(cb);
  }

  onDelete(cb = noop) {
    this.onDeleteCallbacks.push(cb);
  }

  onManuscriptChange(cb = noop) {
    this.onManuscriptChangeCallbacks.push(cb);
  }
}

window.ExampleFileAccessor = ExampleFileAccessor;