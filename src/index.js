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

// Create our client side file system for markuapad to work with.
if (!getCached("markuapad_files")) {
  setCached("example/book.txt", "chapter1.txt\nchapter2.txt");
  setCached("example/manuscript/chapter1.txt", "#Chapter 1\n\nHere is the first chapter");
  setCached("example/manuscript/chapter2.txt", "#Chapter 2\n\nHere is the second chapter");
  setCached("markuapad_files", ["example/book.txt", "example/manuscript/chapter1.txt", "example/manuscript/chapter2.txt"])
}

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
    cb(null, getCached("markuapad_files").split(",").map(function(k) { return k.substr(k.indexOf("/") + 1) }));
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