require("./styles/index.scss");

let _ = require("underscore");

let noop = () => {};

// Helpers for the localstorage manipulation
let getCached = (key, defaultValue) => {
  let value;
  if (value = localStorage.getItem(key))
    try {
      value = JSON.parse(value);
      return value
    }
    catch(error) {
      return value;
    }
  else
    return defaultValue;
}

let setCached = (key, value) => {
  localStorage.setItem(key, (typeof value === "string" ? value : JSON.stringify(value)));
  return value;
}

let INITIAL_FILES = [
  { path: "my-first-markuapad-book/code", type: "folder", content: null },
  { path: "my-first-markuapad-book/book.txt", type: "text", content: "chapter1.txt\nchapter2.txt" },
  { path: "my-first-markuapad-book/chapter1.txt", type: "text", content: "#Chapter 1\n\nHere is the first chapter" },
  { path: "my-first-markuapad-book/chapter2.txt", type: "text", content: "#Chapter 2\n\nHere is the second chapter" },
  // { path: "my-first-markuapad-book/images", type: "folder", content: null },
  // { path: "my-first-markuapad-book/images/chapter2.png", type: "image", content: "http://c4.staticflickr.com/4/3765/12647024594_09444dea87_n.jpg", parent: "my-first-markuapad-book/images" },
  { path: "my-first-markuapad-book/code/sample.js", type: "code", content: "function() {\n  console.log('Hello, World!');\n}\n", parent: "my-first-markuapad-book/code" }
]

// Create our client side files for markuapad to work with.
if (!getCached("markuapad_files")) {
  for (let file of INITIAL_FILES) {
    setCached(file.path, file);
  }
  setCached("markuapad_files", _.map(INITIAL_FILES, (file) => { return _.omit(file, "content") }));
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
  }

  get(path, cb = noop) {
    let file = getCached(path);
    cb(null, file && file.content);
  }

  getSync(path) {
    let file = getCached(path);
    return file && file.content;
  }

  list(cb = noop) {
    let files = getCached("markuapad_files")
    cb(null, files ? _.map(files, function(file) { return _.omit(file, "content"); }) : []);
  }

  save(path, content, cb = noop) {
    // Get the current version
    let file = getCached(path);
    file.content = content;

    setCached(file.path, file);
    cb(null);
  }

  new(path, type = "text", content = "", cb = noop) {
    let file = { path: path, type: type, content: content }

    setCached(path, file);
    setCached("markuapad_files", getCached("markuapad_files").concat([file]));

    cb(null);

    // Fire stored callbacks
    for (let callback of this.onAddCallbacks)
      callback(file);
  }

  delete(path, cb = noop) {
    let files = getCached("markuapad_files");

    // Remove the file
    localStorage.removeItem(path);

    // Update file list
    files = _.reject(files, (file) => { return file.path === path; });
    setCached("markuapad_files", files)

    // Call the given callback
    cb(null);

    // Fire stored callbacks
    for (let callback of this.onDeleteCallbacks)
      callback(path);
  }

  onAdd(cb = noop) {
    this.onAddCallbacks.push(cb);
  }

  onDelete(cb = noop) {
    this.onDeleteCallbacks.push(cb);
  }
}

window.ExampleFileAccessor = ExampleFileAccessor;