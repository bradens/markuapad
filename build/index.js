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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	__webpack_require__(257);

	var noop = function noop() {};

	// Helpers for the localstorage manipulation
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
	// Since this is as client side data store implementation, there is

	var ExampleFileAccessor = (function () {
	  function ExampleFileAccessor(projectRoot) {
	    _classCallCheck(this, ExampleFileAccessor);

	    this.projectRoot = projectRoot;
	    this.onAddCallbacks = [];
	    this.onDeleteCallbacks = [];
	  }

	  _createClass(ExampleFileAccessor, [{
	    key: "get",
	    value: function get(path) {
	      var cb = arguments[1] === undefined ? noop : arguments[1];

	      cb(null, getCached("" + this.projectRoot + "/" + path));
	    }
	  }, {
	    key: "getSync",
	    value: function getSync(path) {
	      return getCached("" + this.projectRoot + "/" + path);
	    }
	  }, {
	    key: "list",
	    value: function list() {
	      var cb = arguments[0] === undefined ? noop : arguments[0];

	      var files = getCached("markuapad_files");
	      cb(null, files ? files.split(",").map(function (k) {
	        return k.substr(k.indexOf("/") + 1);
	      }) : []);
	    }
	  }, {
	    key: "save",
	    value: function save(path, contents) {
	      var cb = arguments[2] === undefined ? noop : arguments[2];

	      setCached("" + this.projectRoot + "/" + path, contents);
	      cb(null);
	    }
	  }, {
	    key: "new",
	    value: function _new(path) {
	      var cb = arguments[1] === undefined ? noop : arguments[1];

	      setCached("" + this.projectRoot + "/" + path, "");
	      setCached("markuapad_files", getCached("markuapad_files").split(",").concat("" + this.projectRoot + "/" + path));

	      cb(null);

	      // Fire stored callbacks
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.onAddCallbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var callback = _step.value;

	          callback(path);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator["return"]) {
	            _iterator["return"]();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }, {
	    key: "delete",
	    value: function _delete(path) {
	      var cb = arguments[1] === undefined ? noop : arguments[1];

	      var expandedPath = "" + this.projectRoot + "/" + path;
	      var files = getCached("markuapad_files").split(",");

	      // Remove the file
	      localStorage.removeItem(expandedPath);

	      // Update file list
	      files.splice(files.indexOf(expandedPath), 1);
	      setCached("markuapad_files", files);

	      // Call the given callback
	      cb(null);

	      // Fire stored callbacks
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        for (var _iterator2 = this.onDeleteCallbacks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var callback = _step2.value;

	          callback(path);
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
	            _iterator2["return"]();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	    }
	  }, {
	    key: "onAdd",
	    value: function onAdd() {
	      var cb = arguments[0] === undefined ? noop : arguments[0];

	      this.onAddCallbacks.push(cb);
	    }
	  }, {
	    key: "onDelete",
	    value: function onDelete() {
	      var cb = arguments[0] === undefined ? noop : arguments[0];

	      this.onDeleteCallbacks.push(cb);
	    }
	  }]);

	  return ExampleFileAccessor;
	})();

	window.ExampleFileAccessor = ExampleFileAccessor;

/***/ },

/***/ 257:
/***/ function(module, exports, __webpack_require__) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });