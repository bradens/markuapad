// Helpers for the localstorage manipulation
let getCached = (key, defaultValue) => {
  let value;
  if (value = localStorage.getItem(key))
    return value;
  else
    return defaultValue;
}
let setCached = (key, value) => {
  localStorage.setItem(key, value);
  return value;
}

// Create our client side files for markuapad to work with.
if (!getCached("markuapad_files")) {
  setCached("my-first-markuapad-book/book.txt", "chapter1.txt\nchapter2.txt");
  setCached("my-first-markuapad-book/chapter1.txt", "#Chapter 1\n\nHere is the first chapter");
  setCached("my-first-markuapad-book/chapter2.txt", "#Chapter 2\n\nHere is the second chapter");
  setCached("markuapad_files", ["my-first-markuapad-book/book.txt", "my-first-markuapad-book/chapter1.txt", "my-first-markuapad-book/chapter2.txt"])
}

// This is the file accessor that you must implement before creating a new markuapad instance.
// All I/O operations go through this.
// This implementation is for use in the browser, and is only for demo purposes, so we use
// localstorage as the data store.
class ExampleFileAccessor {
  constructor(projectRoot) {
    this.projectRoot = projectRoot
  }

  get(path, cb) {
    cb(null, getCached(`${this.projectRoot}/${path}`));
  }

  getSync(path) {
    return getCached(`${this.projectRoot}/${path}`);
  }

  list(cb) {
    let files = getCached("markuapad_files")
    cb(null, files ? files.split(",").map(function(k) { return k.substr(k.indexOf("/") + 1) }) : []);
  }

  save(path, contents, cb) {
    setCached(`${this.projectRoot}/${path}`, contents);
    cb(null);
  }

  new(path, cb) {
    setCached(`${this.projectRoot}/${path}`, "");
    setCached("markuapad_files", getCached("markuapad_files").split(",").concat(`${this.projectRoot}/${path}`));
    cb(null);
  }

  delete(path, cb) {
    path = `${this.projectRoot}/${path}`;
    let files = getCached("markuapad_files").split(",");

    // Remove the file
    localStorage.removeItem(path);

    // Update file list
    files.splice(files.indexOf(path), 1);
    setCached("markuapad_files", files)
    cb(null);
  }
}

window.ExampleFileAccessor = ExampleFileAccessor;