/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// Helpers for the localstorage manipulation
	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var getCached = function getCached(key, defaultValue) {
	  var value = undefined;
	  if (value = localStorage.getItem(key)) return value;else return defaultValue;
	};
	var setCached = function setCached(key, value) {
	  localStorage.setItem(key, value);
	  return value;
	};

	// Create our client side files for markuapad to work with.
	if (!getCached("markuapad_files")) {
	  setCached("my-first-markuapad-book/book.txt", "chapter1.txt\nchapter2.txt");
	  setCached("my-first-markuapad-book/chapter1.txt", "#Chapter 1\n\nHere is the first chapter");
	  setCached("my-first-markuapad-book/chapter2.txt", "#Chapter 2\n\nHere is the second chapter");
	  setCached("markuapad_files", ["my-first-markuapad-book/book.txt", "my-first-markuapad-book/chapter1.txt", "my-first-markuapad-book/chapter2.txt"]);
	}

	// This is the file accessor that you must implement before creating a new markuapad instance.
	// All I/O operations go through this.
	// This implementation is for use in the browser, and is only for demo purposes, so we use
	// localstorage as the data store.

	var ExampleFileAccessor = (function () {
	  function ExampleFileAccessor(projectRoot) {
	    _classCallCheck(this, ExampleFileAccessor);

	    this.projectRoot = projectRoot;
	  }

	  _createClass(ExampleFileAccessor, [{
	    key: "get",
	    value: function get(path, cb) {
	      cb(null, getCached("" + this.projectRoot + "/" + path));
	    }
	  }, {
	    key: "getSync",
	    value: function getSync(path) {
	      return getCached("" + this.projectRoot + "/" + path);
	    }
	  }, {
	    key: "list",
	    value: function list(cb) {
	      var files = getCached("markuapad_files");
	      cb(null, files ? files.split(",").map(function (k) {
	        return k.substr(k.indexOf("/") + 1);
	      }) : []);
	    }
	  }, {
	    key: "save",
	    value: function save(path, contents, cb) {
	      setCached("" + this.projectRoot + "/" + path, contents);
	      cb(null);
	    }
	  }, {
	    key: "new",
	    value: function _new(path, cb) {
	      setCached("" + this.projectRoot + "/" + path, "");
	      setCached("markuapad_files", getCached("markuapad_files").split(",").concat("" + this.projectRoot + "/" + path));
	      cb(null);
	    }
	  }, {
	    key: "delete",
	    value: function _delete(path, cb) {
	      path = "" + this.projectRoot + "/" + path;
	      var files = getCached("markuapad_files").split(",");

	      // Remove the file
	      localStorage.removeItem(path);

	      // Update file list
	      files.splice(files.indexOf(path), 1);
	      setCached("markuapad_files", files);
	      cb(null);
	    }
	  }]);

	  return ExampleFileAccessor;
	})();

	window.ExampleFileAccessor = ExampleFileAccessor;

/***/ }
/******/ ]);