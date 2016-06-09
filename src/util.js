let imageTagFixRegex = /src="images\/([\w,\s-]+\.(?:(?:png)|(?:jpg)|(?:jpeg)|(?:gif)|(?:bmp)))/;
let allImageTagFixRegex = new RegExp(imageTagFixRegex.source, "g");

import FileAccessor from "./file_accessor"

export let fixImagePaths = (htmlString, rerun) => {
  let matches = htmlString.match(allImageTagFixRegex);

  for (let match of matches || []) {
    let key = match.substr(match.lastIndexOf("/") + 1)
    let file = FileAccessor.getSync(key, "image", rerun);
    let uri;

    if (!file) {
      FileAccessor.get(key, rerun, "image");
      continue;
    } else if (file.data) {
      uri = `data:${file.mimetype.string};base64,${file.data}`
    } else if (file.url) {
      uri = file.url
    }
    htmlString = htmlString.replace(imageTagFixRegex, `src="${uri}`)
  }
  return htmlString;
}

// Helpers for the localstorage manipulation
export let getCached = (key, defaultValue) => {
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

export let setCached = (key, value) => {
  localStorage.setItem(key, (typeof value === "string" ? value : JSON.stringify(value)));
  return value;
}
