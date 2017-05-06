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
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

eval("/*!\n * Retina.js v1.1.0\n *\n * Copyright 2013 Imulus, LLC\n * Released under the MIT license\n *\n * Retina.js is an open source script that makes it easy to serve\n * high-resolution images to devices with retina displays.\n */\n(function() {\n\n  var root = ( false ? window : exports);\n\n  var config = {\n    // Ensure Content-Type is an image before trying to load @2x image\n    // https://github.com/imulus/retinajs/pull/45)\n    check_mime_type: true\n  };\n\n\n\n  root.Retina = Retina;\n\n  function Retina() {}\n\n  Retina.configure = function(options) {\n    if (options == null) options = {};\n    for (var prop in options) config[prop] = options[prop];\n  };\n\n  Retina.init = function(context) {\n    if (context == null) context = root;\n\n    var existing_onload = context.onload || new Function;\n\n    context.onload = function() {\n      var images = document.getElementsByTagName(\"img\"), retinaImages = [], i, image;\n      for (i = 0; i < images.length; i++) {\n        image = images[i];\n        retinaImages.push(new RetinaImage(image));\n      }\n      existing_onload();\n    }\n  };\n\n  Retina.isRetina = function(){\n    var mediaQuery = \"(-webkit-min-device-pixel-ratio: 1.5),\\\n                      (min--moz-device-pixel-ratio: 1.5),\\\n                      (-o-min-device-pixel-ratio: 3/2),\\\n                      (min-resolution: 1.5dppx)\";\n\n    if (root.devicePixelRatio > 1)\n      return true;\n\n    if (root.matchMedia && root.matchMedia(mediaQuery).matches)\n      return true;\n\n    return false;\n  };\n\n\n  root.RetinaImagePath = RetinaImagePath;\n\n  function RetinaImagePath(path, at_2x_path) {\n    this.path = path;\n    if (typeof at_2x_path !== \"undefined\" && at_2x_path !== null) {\n      this.at_2x_path = at_2x_path;\n      this.perform_check = false;\n    } else {\n      this.at_2x_path = path.replace(/\\.\\w+$/, function(match) { return \"@2x\" + match; });\n      this.perform_check = true;\n    }\n  }\n\n  RetinaImagePath.confirmed_paths = [];\n\n  RetinaImagePath.prototype.is_external = function() {\n    return !!(this.path.match(/^https?\\:/i) && !this.path.match('//' + document.domain) )\n  }\n\n  RetinaImagePath.prototype.check_2x_variant = function(callback) {\n    var http, that = this;\n    if (this.is_external()) {\n      return callback(false);\n    } else if (!this.perform_check && typeof this.at_2x_path !== \"undefined\" && this.at_2x_path !== null) {\n      return callback(true);\n    } else if (this.at_2x_path in RetinaImagePath.confirmed_paths) {\n      return callback(true);\n    } else {\n      http = new XMLHttpRequest;\n      http.open('HEAD', this.at_2x_path);\n      http.onreadystatechange = function() {\n        if (http.readyState != 4) {\n          return callback(false);\n        }\n\n        if (http.status >= 200 && http.status <= 399) {\n          if (config.check_mime_type) {\n            var type = http.getResponseHeader('Content-Type');\n            if (type == null || !type.match(/^image/i)) {\n              return callback(false);\n            }\n          }\n\n          RetinaImagePath.confirmed_paths.push(that.at_2x_path);\n          return callback(true);\n        } else {\n          return callback(false);\n        }\n      }\n      http.send();\n    }\n  }\n\n\n\n  function RetinaImage(el) {\n    this.el = el;\n    this.path = new RetinaImagePath(this.el.getAttribute('src'), this.el.getAttribute('data-at2x'));\n    var that = this;\n    this.path.check_2x_variant(function(hasVariant) {\n      if (hasVariant) that.swap();\n    });\n  }\n\n  root.RetinaImage = RetinaImage;\n\n  RetinaImage.prototype.swap = function(path) {\n    if (typeof path == 'undefined') path = this.path.at_2x_path;\n\n    var that = this;\n    function load() {\n      if (! that.el.complete) {\n        setTimeout(load, 5);\n      } else {\n        that.el.setAttribute('width', that.el.offsetWidth);\n        that.el.setAttribute('height', that.el.offsetHeight);\n        that.el.setAttribute('src', path);\n      }\n    }\n    load();\n  }\n\n\n\n\n  if (Retina.isRetina()) {\n    Retina.init(root);\n  }\n\n})();\n\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9yZXNvdXJjZXMvYXNzZXRzL2pzL3JldGluYS0xLjEuMC5qcz8yNDg4Il0sInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogUmV0aW5hLmpzIHYxLjEuMFxuICpcbiAqIENvcHlyaWdodCAyMDEzIEltdWx1cywgTExDXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqXG4gKiBSZXRpbmEuanMgaXMgYW4gb3BlbiBzb3VyY2Ugc2NyaXB0IHRoYXQgbWFrZXMgaXQgZWFzeSB0byBzZXJ2ZVxuICogaGlnaC1yZXNvbHV0aW9uIGltYWdlcyB0byBkZXZpY2VzIHdpdGggcmV0aW5hIGRpc3BsYXlzLlxuICovXG4oZnVuY3Rpb24oKSB7XG5cbiAgdmFyIHJvb3QgPSAodHlwZW9mIGV4cG9ydHMgPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiBleHBvcnRzKTtcblxuICB2YXIgY29uZmlnID0ge1xuICAgIC8vIEVuc3VyZSBDb250ZW50LVR5cGUgaXMgYW4gaW1hZ2UgYmVmb3JlIHRyeWluZyB0byBsb2FkIEAyeCBpbWFnZVxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9pbXVsdXMvcmV0aW5hanMvcHVsbC80NSlcbiAgICBjaGVja19taW1lX3R5cGU6IHRydWVcbiAgfTtcblxuXG5cbiAgcm9vdC5SZXRpbmEgPSBSZXRpbmE7XG5cbiAgZnVuY3Rpb24gUmV0aW5hKCkge31cblxuICBSZXRpbmEuY29uZmlndXJlID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09IG51bGwpIG9wdGlvbnMgPSB7fTtcbiAgICBmb3IgKHZhciBwcm9wIGluIG9wdGlvbnMpIGNvbmZpZ1twcm9wXSA9IG9wdGlvbnNbcHJvcF07XG4gIH07XG5cbiAgUmV0aW5hLmluaXQgPSBmdW5jdGlvbihjb250ZXh0KSB7XG4gICAgaWYgKGNvbnRleHQgPT0gbnVsbCkgY29udGV4dCA9IHJvb3Q7XG5cbiAgICB2YXIgZXhpc3Rpbmdfb25sb2FkID0gY29udGV4dC5vbmxvYWQgfHwgbmV3IEZ1bmN0aW9uO1xuXG4gICAgY29udGV4dC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpbWFnZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImltZ1wiKSwgcmV0aW5hSW1hZ2VzID0gW10sIGksIGltYWdlO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGltYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpbWFnZSA9IGltYWdlc1tpXTtcbiAgICAgICAgcmV0aW5hSW1hZ2VzLnB1c2gobmV3IFJldGluYUltYWdlKGltYWdlKSk7XG4gICAgICB9XG4gICAgICBleGlzdGluZ19vbmxvYWQoKTtcbiAgICB9XG4gIH07XG5cbiAgUmV0aW5hLmlzUmV0aW5hID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgbWVkaWFRdWVyeSA9IFwiKC13ZWJraXQtbWluLWRldmljZS1waXhlbC1yYXRpbzogMS41KSxcXFxuICAgICAgICAgICAgICAgICAgICAgIChtaW4tLW1vei1kZXZpY2UtcGl4ZWwtcmF0aW86IDEuNSksXFxcbiAgICAgICAgICAgICAgICAgICAgICAoLW8tbWluLWRldmljZS1waXhlbC1yYXRpbzogMy8yKSxcXFxuICAgICAgICAgICAgICAgICAgICAgIChtaW4tcmVzb2x1dGlvbjogMS41ZHBweClcIjtcblxuICAgIGlmIChyb290LmRldmljZVBpeGVsUmF0aW8gPiAxKVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICBpZiAocm9vdC5tYXRjaE1lZGlhICYmIHJvb3QubWF0Y2hNZWRpYShtZWRpYVF1ZXJ5KS5tYXRjaGVzKVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cblxuICByb290LlJldGluYUltYWdlUGF0aCA9IFJldGluYUltYWdlUGF0aDtcblxuICBmdW5jdGlvbiBSZXRpbmFJbWFnZVBhdGgocGF0aCwgYXRfMnhfcGF0aCkge1xuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgaWYgKHR5cGVvZiBhdF8yeF9wYXRoICE9PSBcInVuZGVmaW5lZFwiICYmIGF0XzJ4X3BhdGggIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYXRfMnhfcGF0aCA9IGF0XzJ4X3BhdGg7XG4gICAgICB0aGlzLnBlcmZvcm1fY2hlY2sgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hdF8yeF9wYXRoID0gcGF0aC5yZXBsYWNlKC9cXC5cXHcrJC8sIGZ1bmN0aW9uKG1hdGNoKSB7IHJldHVybiBcIkAyeFwiICsgbWF0Y2g7IH0pO1xuICAgICAgdGhpcy5wZXJmb3JtX2NoZWNrID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBSZXRpbmFJbWFnZVBhdGguY29uZmlybWVkX3BhdGhzID0gW107XG5cbiAgUmV0aW5hSW1hZ2VQYXRoLnByb3RvdHlwZS5pc19leHRlcm5hbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAhISh0aGlzLnBhdGgubWF0Y2goL15odHRwcz9cXDovaSkgJiYgIXRoaXMucGF0aC5tYXRjaCgnLy8nICsgZG9jdW1lbnQuZG9tYWluKSApXG4gIH1cblxuICBSZXRpbmFJbWFnZVBhdGgucHJvdG90eXBlLmNoZWNrXzJ4X3ZhcmlhbnQgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHZhciBodHRwLCB0aGF0ID0gdGhpcztcbiAgICBpZiAodGhpcy5pc19leHRlcm5hbCgpKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soZmFsc2UpO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMucGVyZm9ybV9jaGVjayAmJiB0eXBlb2YgdGhpcy5hdF8yeF9wYXRoICE9PSBcInVuZGVmaW5lZFwiICYmIHRoaXMuYXRfMnhfcGF0aCAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKHRydWUpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hdF8yeF9wYXRoIGluIFJldGluYUltYWdlUGF0aC5jb25maXJtZWRfcGF0aHMpIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayh0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdDtcbiAgICAgIGh0dHAub3BlbignSEVBRCcsIHRoaXMuYXRfMnhfcGF0aCk7XG4gICAgICBodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoaHR0cC5yZWFkeVN0YXRlICE9IDQpIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGh0dHAuc3RhdHVzID49IDIwMCAmJiBodHRwLnN0YXR1cyA8PSAzOTkpIHtcbiAgICAgICAgICBpZiAoY29uZmlnLmNoZWNrX21pbWVfdHlwZSkge1xuICAgICAgICAgICAgdmFyIHR5cGUgPSBodHRwLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IG51bGwgfHwgIXR5cGUubWF0Y2goL15pbWFnZS9pKSkge1xuICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIFJldGluYUltYWdlUGF0aC5jb25maXJtZWRfcGF0aHMucHVzaCh0aGF0LmF0XzJ4X3BhdGgpO1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayh0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBodHRwLnNlbmQoKTtcbiAgICB9XG4gIH1cblxuXG5cbiAgZnVuY3Rpb24gUmV0aW5hSW1hZ2UoZWwpIHtcbiAgICB0aGlzLmVsID0gZWw7XG4gICAgdGhpcy5wYXRoID0gbmV3IFJldGluYUltYWdlUGF0aCh0aGlzLmVsLmdldEF0dHJpYnV0ZSgnc3JjJyksIHRoaXMuZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWF0MngnKSk7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMucGF0aC5jaGVja18yeF92YXJpYW50KGZ1bmN0aW9uKGhhc1ZhcmlhbnQpIHtcbiAgICAgIGlmIChoYXNWYXJpYW50KSB0aGF0LnN3YXAoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJvb3QuUmV0aW5hSW1hZ2UgPSBSZXRpbmFJbWFnZTtcblxuICBSZXRpbmFJbWFnZS5wcm90b3R5cGUuc3dhcCA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICBpZiAodHlwZW9mIHBhdGggPT0gJ3VuZGVmaW5lZCcpIHBhdGggPSB0aGlzLnBhdGguYXRfMnhfcGF0aDtcblxuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICBmdW5jdGlvbiBsb2FkKCkge1xuICAgICAgaWYgKCEgdGhhdC5lbC5jb21wbGV0ZSkge1xuICAgICAgICBzZXRUaW1lb3V0KGxvYWQsIDUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhhdC5lbC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdGhhdC5lbC5vZmZzZXRXaWR0aCk7XG4gICAgICAgIHRoYXQuZWwuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCB0aGF0LmVsLm9mZnNldEhlaWdodCk7XG4gICAgICAgIHRoYXQuZWwuc2V0QXR0cmlidXRlKCdzcmMnLCBwYXRoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbG9hZCgpO1xuICB9XG5cblxuXG5cbiAgaWYgKFJldGluYS5pc1JldGluYSgpKSB7XG4gICAgUmV0aW5hLmluaXQocm9vdCk7XG4gIH1cblxufSkoKTtcblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHJlc291cmNlcy9hc3NldHMvanMvcmV0aW5hLTEuMS4wLmpzIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ }
/******/ ]);