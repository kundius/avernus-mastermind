/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/whatwg-fetch/fetch.js":
/*!********************************************!*\
  !*** ./node_modules/whatwg-fetch/fetch.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DOMException": () => (/* binding */ DOMException),
/* harmony export */   "Headers": () => (/* binding */ Headers),
/* harmony export */   "Request": () => (/* binding */ Request),
/* harmony export */   "Response": () => (/* binding */ Response),
/* harmony export */   "fetch": () => (/* binding */ fetch)
/* harmony export */ });
var global = typeof globalThis !== 'undefined' && globalThis || typeof self !== 'undefined' && self || typeof global !== 'undefined' && global;
var support = {
  searchParams: 'URLSearchParams' in global,
  iterable: 'Symbol' in global && 'iterator' in Symbol,
  blob: 'FileReader' in global && 'Blob' in global && function () {
    try {
      new Blob();
      return true;
    } catch (e) {
      return false;
    }
  }(),
  formData: 'FormData' in global,
  arrayBuffer: 'ArrayBuffer' in global
};

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj);
}

if (support.arrayBuffer) {
  var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];

  var isArrayBufferView = ArrayBuffer.isView || function (obj) {
    return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
  };
}

function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name);
  }

  if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
    throw new TypeError('Invalid character in header field name: "' + name + '"');
  }

  return name.toLowerCase();
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value);
  }

  return value;
} // Build a destructive iterator for the value list


function iteratorFor(items) {
  var iterator = {
    next: function () {
      var value = items.shift();
      return {
        done: value === undefined,
        value: value
      };
    }
  };

  if (support.iterable) {
    iterator[Symbol.iterator] = function () {
      return iterator;
    };
  }

  return iterator;
}

function Headers(headers) {
  this.map = {};

  if (headers instanceof Headers) {
    headers.forEach(function (value, name) {
      this.append(name, value);
    }, this);
  } else if (Array.isArray(headers)) {
    headers.forEach(function (header) {
      this.append(header[0], header[1]);
    }, this);
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function (name) {
      this.append(name, headers[name]);
    }, this);
  }
}

Headers.prototype.append = function (name, value) {
  name = normalizeName(name);
  value = normalizeValue(value);
  var oldValue = this.map[name];
  this.map[name] = oldValue ? oldValue + ', ' + value : value;
};

Headers.prototype['delete'] = function (name) {
  delete this.map[normalizeName(name)];
};

Headers.prototype.get = function (name) {
  name = normalizeName(name);
  return this.has(name) ? this.map[name] : null;
};

Headers.prototype.has = function (name) {
  return this.map.hasOwnProperty(normalizeName(name));
};

Headers.prototype.set = function (name, value) {
  this.map[normalizeName(name)] = normalizeValue(value);
};

Headers.prototype.forEach = function (callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this);
    }
  }
};

Headers.prototype.keys = function () {
  var items = [];
  this.forEach(function (value, name) {
    items.push(name);
  });
  return iteratorFor(items);
};

Headers.prototype.values = function () {
  var items = [];
  this.forEach(function (value) {
    items.push(value);
  });
  return iteratorFor(items);
};

Headers.prototype.entries = function () {
  var items = [];
  this.forEach(function (value, name) {
    items.push([name, value]);
  });
  return iteratorFor(items);
};

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
}

function consumed(body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'));
  }

  body.bodyUsed = true;
}

function fileReaderReady(reader) {
  return new Promise(function (resolve, reject) {
    reader.onload = function () {
      resolve(reader.result);
    };

    reader.onerror = function () {
      reject(reader.error);
    };
  });
}

function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  reader.readAsArrayBuffer(blob);
  return promise;
}

function readBlobAsText(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  reader.readAsText(blob);
  return promise;
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf);
  var chars = new Array(view.length);

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i]);
  }

  return chars.join('');
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0);
  } else {
    var view = new Uint8Array(buf.byteLength);
    view.set(new Uint8Array(buf));
    return view.buffer;
  }
}

function Body() {
  this.bodyUsed = false;

  this._initBody = function (body) {
    /*
      fetch-mock wraps the Response object in an ES6 Proxy to
      provide useful test harness features such as flush. However, on
      ES5 browsers without fetch or Proxy support pollyfills must be used;
      the proxy-pollyfill is unable to proxy an attribute unless it exists
      on the object before the Proxy is created. This change ensures
      Response.bodyUsed exists on the instance, while maintaining the
      semantic of setting Request.bodyUsed in the constructor before
      _initBody is called.
    */
    this.bodyUsed = this.bodyUsed;
    this._bodyInit = body;

    if (!body) {
      this._bodyText = '';
    } else if (typeof body === 'string') {
      this._bodyText = body;
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body;
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body;
    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString();
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer); // IE 10-11 can't handle a DataView body.

      this._bodyInit = new Blob([this._bodyArrayBuffer]);
    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
      this._bodyArrayBuffer = bufferClone(body);
    } else {
      this._bodyText = body = Object.prototype.toString.call(body);
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8');
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type);
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
      }
    }
  };

  if (support.blob) {
    this.blob = function () {
      var rejected = consumed(this);

      if (rejected) {
        return rejected;
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]));
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as blob');
      } else {
        return Promise.resolve(new Blob([this._bodyText]));
      }
    };

    this.arrayBuffer = function () {
      if (this._bodyArrayBuffer) {
        var isConsumed = consumed(this);

        if (isConsumed) {
          return isConsumed;
        }

        if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
          return Promise.resolve(this._bodyArrayBuffer.buffer.slice(this._bodyArrayBuffer.byteOffset, this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength));
        } else {
          return Promise.resolve(this._bodyArrayBuffer);
        }
      } else {
        return this.blob().then(readBlobAsArrayBuffer);
      }
    };
  }

  this.text = function () {
    var rejected = consumed(this);

    if (rejected) {
      return rejected;
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob);
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text');
    } else {
      return Promise.resolve(this._bodyText);
    }
  };

  if (support.formData) {
    this.formData = function () {
      return this.text().then(decode);
    };
  }

  this.json = function () {
    return this.text().then(JSON.parse);
  };

  return this;
} // HTTP methods whose capitalization should be normalized


var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

function normalizeMethod(method) {
  var upcased = method.toUpperCase();
  return methods.indexOf(upcased) > -1 ? upcased : method;
}

function Request(input, options) {
  if (!(this instanceof Request)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  }

  options = options || {};
  var body = options.body;

  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError('Already read');
    }

    this.url = input.url;
    this.credentials = input.credentials;

    if (!options.headers) {
      this.headers = new Headers(input.headers);
    }

    this.method = input.method;
    this.mode = input.mode;
    this.signal = input.signal;

    if (!body && input._bodyInit != null) {
      body = input._bodyInit;
      input.bodyUsed = true;
    }
  } else {
    this.url = String(input);
  }

  this.credentials = options.credentials || this.credentials || 'same-origin';

  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers);
  }

  this.method = normalizeMethod(options.method || this.method || 'GET');
  this.mode = options.mode || this.mode || null;
  this.signal = options.signal || this.signal;
  this.referrer = null;

  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
    throw new TypeError('Body not allowed for GET or HEAD requests');
  }

  this._initBody(body);

  if (this.method === 'GET' || this.method === 'HEAD') {
    if (options.cache === 'no-store' || options.cache === 'no-cache') {
      // Search for a '_' parameter in the query string
      var reParamSearch = /([?&])_=[^&]*/;

      if (reParamSearch.test(this.url)) {
        // If it already exists then set the value with the current time
        this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime());
      } else {
        // Otherwise add a new '_' parameter to the end with the current time
        var reQueryString = /\?/;
        this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime();
      }
    }
  }
}

Request.prototype.clone = function () {
  return new Request(this, {
    body: this._bodyInit
  });
};

function decode(body) {
  var form = new FormData();
  body.trim().split('&').forEach(function (bytes) {
    if (bytes) {
      var split = bytes.split('=');
      var name = split.shift().replace(/\+/g, ' ');
      var value = split.join('=').replace(/\+/g, ' ');
      form.append(decodeURIComponent(name), decodeURIComponent(value));
    }
  });
  return form;
}

function parseHeaders(rawHeaders) {
  var headers = new Headers(); // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2

  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' '); // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
  // https://github.com/github/fetch/issues/748
  // https://github.com/zloirock/core-js/issues/751

  preProcessedHeaders.split('\r').map(function (header) {
    return header.indexOf('\n') === 0 ? header.substr(1, header.length) : header;
  }).forEach(function (line) {
    var parts = line.split(':');
    var key = parts.shift().trim();

    if (key) {
      var value = parts.join(':').trim();
      headers.append(key, value);
    }
  });
  return headers;
}

Body.call(Request.prototype);
function Response(bodyInit, options) {
  if (!(this instanceof Response)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  }

  if (!options) {
    options = {};
  }

  this.type = 'default';
  this.status = options.status === undefined ? 200 : options.status;
  this.ok = this.status >= 200 && this.status < 300;
  this.statusText = options.statusText === undefined ? '' : '' + options.statusText;
  this.headers = new Headers(options.headers);
  this.url = options.url || '';

  this._initBody(bodyInit);
}
Body.call(Response.prototype);

Response.prototype.clone = function () {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url
  });
};

Response.error = function () {
  var response = new Response(null, {
    status: 0,
    statusText: ''
  });
  response.type = 'error';
  return response;
};

var redirectStatuses = [301, 302, 303, 307, 308];

Response.redirect = function (url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError('Invalid status code');
  }

  return new Response(null, {
    status: status,
    headers: {
      location: url
    }
  });
};

var DOMException = global.DOMException;

try {
  new DOMException();
} catch (err) {
  DOMException = function (message, name) {
    this.message = message;
    this.name = name;
    var error = Error(message);
    this.stack = error.stack;
  };

  DOMException.prototype = Object.create(Error.prototype);
  DOMException.prototype.constructor = DOMException;
}

function fetch(input, init) {
  return new Promise(function (resolve, reject) {
    var request = new Request(input, init);

    if (request.signal && request.signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    var xhr = new XMLHttpRequest();

    function abortXhr() {
      xhr.abort();
    }

    xhr.onload = function () {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      };
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
      var body = 'response' in xhr ? xhr.response : xhr.responseText;
      setTimeout(function () {
        resolve(new Response(body, options));
      }, 0);
    };

    xhr.onerror = function () {
      setTimeout(function () {
        reject(new TypeError('Network request failed'));
      }, 0);
    };

    xhr.ontimeout = function () {
      setTimeout(function () {
        reject(new TypeError('Network request failed'));
      }, 0);
    };

    xhr.onabort = function () {
      setTimeout(function () {
        reject(new DOMException('Aborted', 'AbortError'));
      }, 0);
    };

    function fixUrl(url) {
      try {
        return url === '' && global.location.href ? global.location.href : url;
      } catch (e) {
        return url;
      }
    }

    xhr.open(request.method, fixUrl(request.url), true);

    if (request.credentials === 'include') {
      xhr.withCredentials = true;
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false;
    }

    if ('responseType' in xhr) {
      if (support.blob) {
        xhr.responseType = 'blob';
      } else if (support.arrayBuffer && request.headers.get('Content-Type') && request.headers.get('Content-Type').indexOf('application/octet-stream') !== -1) {
        xhr.responseType = 'arraybuffer';
      }
    }

    if (init && typeof init.headers === 'object' && !(init.headers instanceof Headers)) {
      Object.getOwnPropertyNames(init.headers).forEach(function (name) {
        xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
      });
    } else {
      request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value);
      });
    }

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr);

      xhr.onreadystatechange = function () {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr);
        }
      };
    }

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
  });
}
fetch.polyfill = true;

if (!global.fetch) {
  global.fetch = fetch;
  global.Headers = Headers;
  global.Request = Request;
  global.Response = Response;
}

/***/ }),

/***/ "./node_modules/throttle-debounce/esm/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/throttle-debounce/esm/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "debounce": () => (/* binding */ debounce),
/* harmony export */   "throttle": () => (/* binding */ throttle)
/* harmony export */ });
/* eslint-disable no-undefined,no-param-reassign,no-shadow */

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param {number} delay -                  A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher)
 *                                            are most useful.
 * @param {Function} callback -               A function to be executed after delay milliseconds. The `this` context and all arguments are passed through,
 *                                            as-is, to `callback` when the throttled-function is executed.
 * @param {object} [options] -              An object to configure options.
 * @param {boolean} [options.noTrailing] -   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds
 *                                            while the throttled-function is being called. If noTrailing is false or unspecified, callback will be executed
 *                                            one final time after the last throttled-function call. (After the throttled-function has not been called for
 *                                            `delay` milliseconds, the internal counter is reset).
 * @param {boolean} [options.noLeading] -   Optional, defaults to false. If noLeading is false, the first throttled-function call will execute callback
 *                                            immediately. If noLeading is true, the first the callback execution will be skipped. It should be noted that
 *                                            callback will never executed if both noLeading = true and noTrailing = true.
 * @param {boolean} [options.debounceMode] - If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is
 *                                            false (at end), schedule `callback` to execute after `delay` ms.
 *
 * @returns {Function} A new, throttled, function.
 */
function throttle(delay, callback, options) {
  var _ref = options || {},
      _ref$noTrailing = _ref.noTrailing,
      noTrailing = _ref$noTrailing === void 0 ? false : _ref$noTrailing,
      _ref$noLeading = _ref.noLeading,
      noLeading = _ref$noLeading === void 0 ? false : _ref$noLeading,
      _ref$debounceMode = _ref.debounceMode,
      debounceMode = _ref$debounceMode === void 0 ? undefined : _ref$debounceMode;
  /*
   * After wrapper has stopped being called, this timeout ensures that
   * `callback` is executed at the proper times in `throttle` and `end`
   * debounce modes.
   */


  var timeoutID;
  var cancelled = false; // Keep track of the last time `callback` was executed.

  var lastExec = 0; // Function to clear existing timeout

  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  } // Function to cancel next exec


  function cancel(options) {
    var _ref2 = options || {},
        _ref2$upcomingOnly = _ref2.upcomingOnly,
        upcomingOnly = _ref2$upcomingOnly === void 0 ? false : _ref2$upcomingOnly;

    clearExistingTimeout();
    cancelled = !upcomingOnly;
  }
  /*
   * The `wrapper` function encapsulates all of the throttling / debouncing
   * functionality and when executed will limit the rate at which `callback`
   * is executed.
   */


  function wrapper() {
    for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
      arguments_[_key] = arguments[_key];
    }

    var self = this;
    var elapsed = Date.now() - lastExec;

    if (cancelled) {
      return;
    } // Execute `callback` and update the `lastExec` timestamp.


    function exec() {
      lastExec = Date.now();
      callback.apply(self, arguments_);
    }
    /*
     * If `debounceMode` is true (at begin) this is used to clear the flag
     * to allow future `callback` executions.
     */


    function clear() {
      timeoutID = undefined;
    }

    if (!noLeading && debounceMode && !timeoutID) {
      /*
       * Since `wrapper` is being called for the first time and
       * `debounceMode` is true (at begin), execute `callback`
       * and noLeading != true.
       */
      exec();
    }

    clearExistingTimeout();

    if (debounceMode === undefined && elapsed > delay) {
      if (noLeading) {
        /*
         * In throttle mode with noLeading, if `delay` time has
         * been exceeded, update `lastExec` and schedule `callback`
         * to execute after `delay` ms.
         */
        lastExec = Date.now();

        if (!noTrailing) {
          timeoutID = setTimeout(debounceMode ? clear : exec, delay);
        }
      } else {
        /*
         * In throttle mode without noLeading, if `delay` time has been exceeded, execute
         * `callback`.
         */
        exec();
      }
    } else if (noTrailing !== true) {
      /*
       * In trailing throttle mode, since `delay` time has not been
       * exceeded, schedule `callback` to execute `delay` ms after most
       * recent execution.
       *
       * If `debounceMode` is true (at begin), schedule `clear` to execute
       * after `delay` ms.
       *
       * If `debounceMode` is false (at end), schedule `callback` to
       * execute after `delay` ms.
       */
      timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
    }
  }

  wrapper.cancel = cancel; // Return the wrapper function.

  return wrapper;
}
/* eslint-disable no-undefined */

/**
 * Debounce execution of a function. Debouncing, unlike throttling,
 * guarantees that a function is only executed a single time, either at the
 * very beginning of a series of calls, or at the very end.
 *
 * @param {number} delay -               A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param {Function} callback -          A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                        to `callback` when the debounced-function is executed.
 * @param {object} [options] -           An object to configure options.
 * @param {boolean} [options.atBegin] -  Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
 *                                        after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
 *                                        (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
 *
 * @returns {Function} A new, debounced function.
 */


function debounce(delay, callback, options) {
  var _ref = options || {},
      _ref$atBegin = _ref.atBegin,
      atBegin = _ref$atBegin === void 0 ? false : _ref$atBegin;

  return throttle(delay, callback, {
    debounceMode: atBegin !== false
  });
}



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./src/scripts/bundle.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var throttle_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! throttle-debounce */ "./node_modules/throttle-debounce/esm/index.js");
/* harmony import */ var whatwg_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! whatwg-fetch */ "./node_modules/whatwg-fetch/fetch.js");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }




var isVisible = function isVisible(elem) {
  return !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
};

var scheduleItems = document.querySelectorAll('.section-schedule__item');

if (scheduleItems.length) {
  var maxWidth = 0;
  scheduleItems.forEach(function (item) {
    if (item.offsetWidth > maxWidth) {
      maxWidth = item.offsetWidth;
    }
  });
  scheduleItems.forEach(function (item) {
    item.style.width = "".concat(maxWidth, "px");
  });
}

var accordions = document.querySelectorAll('[data-accordion]');

if (accordions.length) {
  accordions.forEach(function (accordion) {
    var rows = accordion.querySelectorAll('[data-accordion-row]') || [];
    rows.forEach(function (row) {
      var header = row.querySelector('[data-accordion-header]');
      var content = row.querySelector('[data-accordion-content]');

      var toggle = function toggle() {
        if (content.style.maxHeight) {
          header.classList.remove('_active');
          content.classList.remove('_active');
          content.style.maxHeight = null;
        } else {
          header.classList.add('_active');
          content.classList.add('_active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      };

      header.addEventListener('click', toggle);
    });
  });
}

var modalToggles = document.querySelectorAll('[data-modal-toggle]');

if (modalToggles.length) {
  modalToggles.forEach(function (toggle) {
    var modal = document.querySelector(toggle.dataset.modalToggle);
    var close = modal.querySelector('[data-modal-close]');

    var outsideClickListener = function outsideClickListener(event) {
      if (!modal.contains(event.target) && isVisible(modal) && !toggle.contains(event.target)) {
        hide();
        removeClickListener();
      }
    };

    var removeClickListener = function removeClickListener() {
      document.removeEventListener('click', outsideClickListener);
    };

    var show = function show() {
      modal.classList.add('_opened');
      document.addEventListener('click', outsideClickListener);
    };

    var hide = function hide() {
      modal.classList.remove('_opened');
    };

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      show();
    });
    close.addEventListener('click', function (e) {
      e.preventDefault();
      hide();
    });
  });
}

var header = document.querySelector('.header');
var scrollup = document.querySelector('.scrollup');
var scrollHandler = (0,throttle_debounce__WEBPACK_IMPORTED_MODULE_0__.throttle)(10, function () {
  if (window.pageYOffset > 20) {
    header.classList.add('header_fixed');
  } else {
    header.classList.remove('header_fixed');
  }

  if (window.pageYOffset > 400) {
    scrollup.classList.add('scrollup_fixed');
  } else {
    scrollup.classList.remove('scrollup_fixed');
  }
});
window.addEventListener('scroll', scrollHandler);
var scrolls = document.querySelectorAll('[data-scroll]') || [];
scrolls.forEach(function (scroll) {
  return scroll.addEventListener('click', function (e) {
    e.preventDefault();
    var offset = document.querySelector('.header').offsetHeight;
    var top = 0;
    var left = 0;

    if (scroll.dataset.scroll) {
      var target = document.querySelector(scroll.dataset.scroll);

      if (target) {
        top = target.offsetTop - offset;
      }
    }

    window.scroll({
      top: top,
      left: left,
      behavior: 'smooth'
    });
  });
});
var menuToggle = document.querySelector('.header__toggle');
var menuList = document.querySelector('.header__menu');
menuToggle.addEventListener('click', function () {
  if (menuList.classList.contains('_active')) {
    menuList.classList.remove('_active');
  } else {
    menuList.classList.add('_active');
  }

  if (menuToggle.classList.contains('_active')) {
    menuToggle.classList.remove('_active');
  } else {
    menuToggle.classList.add('_active');
  }
});

var removeFocusableListener = function removeFocusableListener() {
  document.querySelector('body').classList.remove('page-focusable');
  document.removeEventListener('click', removeFocusableListener);
};

document.addEventListener('keyup', function (e) {
  if (e.keyCode === 9) {
    document.querySelector('body').classList.add('page-focusable');
    document.addEventListener('click', removeFocusableListener);
  }
}, false);
var forms = document.querySelectorAll('[data-from]') || [];
forms.forEach(function (form) {
  var messagesContainer = form.querySelector('[data-from-messages]') || form;
  var messages = new Set();

  var showMessage = function showMessage(text, mode, delay) {
    var el = document.createElement('div');
    el.classList.add('ui-form-message');
    el.classList.add('ui-form-message_' + mode);
    el.innerHTML = text;
    var close = document.createElement('button');
    close.classList.add('ui-form-message__close');
    close.addEventListener('click', function (e) {
      e.stopPropagation();
      messages["delete"](el);
      el.parentNode.removeChild(el);
    });
    el.appendChild(close);
    messagesContainer.appendChild(el);
    messages.add(el);

    if (delay) {
      setTimeout(function () {
        messages["delete"](el);
        el.parentNode.removeChild(el);
      }, delay);
    }
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var _iterator = _createForOfIteratorHelper(messages),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var message = _step.value;
        messages["delete"](message);
        message.parentNode.removeChild(message);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form)
    }).then(function (response) {
      return response.json();
    }).then(function (response) {
      if (response.success) {
        form.reset();
        showMessage('Сообщение успешно отправлено', 'success', 8000);
      } else {
        showMessage('В форме присутствуют ошибки', 'error');
      }
    });
  });
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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NUIsSUFBSSxDQUFDZ0osTUFBTixFQUFjO01BQ2pCbEssTUFBTSxFQUFFLE1BRFM7TUFFakJwRCxJQUFJLEVBQUUsSUFBSW1DLFFBQUosQ0FBYW1DLElBQWI7SUFGVyxDQUFkLENBQUwsQ0FJQzFCLElBSkQsQ0FJTSxVQUFBMkMsUUFBUTtNQUFBLE9BQUlBLFFBQVEsQ0FBQ3hDLElBQVQsRUFBSjtJQUFBLENBSmQsRUFLQ0gsSUFMRCxDQUtNLFVBQUEyQyxRQUFRLEVBQUk7TUFDaEIsSUFBSUEsUUFBUSxDQUFDZ0ksT0FBYixFQUFzQjtRQUNwQmpKLElBQUksQ0FBQ2tKLEtBQUw7UUFDQVYsV0FBVyxDQUFDLDhCQUFELEVBQWlDLFNBQWpDLEVBQTRDLElBQTVDLENBQVg7TUFDRCxDQUhELE1BR087UUFDTEEsV0FBVyxDQUFDLDZCQUFELEVBQWdDLE9BQWhDLENBQVg7TUFDRDtJQUNGLENBWkQ7RUFhRCxDQXJCRDtBQXNCRCxDQXBERCxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZXVyb21vbm9saXQtd3AtdGhlbWUvLi9ub2RlX21vZHVsZXMvd2hhdHdnLWZldGNoL2ZldGNoLmpzIiwid2VicGFjazovL2V1cm9tb25vbGl0LXdwLXRoZW1lLy4uL3Rocm90dGxlLmpzIiwid2VicGFjazovL2V1cm9tb25vbGl0LXdwLXRoZW1lLy4uL2RlYm91bmNlLmpzIiwid2VicGFjazovL2V1cm9tb25vbGl0LXdwLXRoZW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2V1cm9tb25vbGl0LXdwLXRoZW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9ldXJvbW9ub2xpdC13cC10aGVtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2V1cm9tb25vbGl0LXdwLXRoZW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZXVyb21vbm9saXQtd3AtdGhlbWUvLi9zcmMvc2NyaXB0cy9idW5kbGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIGdsb2JhbCA9XG4gICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2xvYmFsVGhpcykgfHxcbiAgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyAmJiBzZWxmKSB8fFxuICAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2xvYmFsKVxuXG52YXIgc3VwcG9ydCA9IHtcbiAgc2VhcmNoUGFyYW1zOiAnVVJMU2VhcmNoUGFyYW1zJyBpbiBnbG9iYWwsXG4gIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBnbG9iYWwgJiYgJ2l0ZXJhdG9yJyBpbiBTeW1ib2wsXG4gIGJsb2I6XG4gICAgJ0ZpbGVSZWFkZXInIGluIGdsb2JhbCAmJlxuICAgICdCbG9iJyBpbiBnbG9iYWwgJiZcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBuZXcgQmxvYigpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pKCksXG4gIGZvcm1EYXRhOiAnRm9ybURhdGEnIGluIGdsb2JhbCxcbiAgYXJyYXlCdWZmZXI6ICdBcnJheUJ1ZmZlcicgaW4gZ2xvYmFsXG59XG5cbmZ1bmN0aW9uIGlzRGF0YVZpZXcob2JqKSB7XG4gIHJldHVybiBvYmogJiYgRGF0YVZpZXcucHJvdG90eXBlLmlzUHJvdG90eXBlT2Yob2JqKVxufVxuXG5pZiAoc3VwcG9ydC5hcnJheUJ1ZmZlcikge1xuICB2YXIgdmlld0NsYXNzZXMgPSBbXG4gICAgJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgRmxvYXQ2NEFycmF5XSdcbiAgXVxuXG4gIHZhciBpc0FycmF5QnVmZmVyVmlldyA9XG4gICAgQXJyYXlCdWZmZXIuaXNWaWV3IHx8XG4gICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHZpZXdDbGFzc2VzLmluZGV4T2YoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikpID4gLTFcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgbmFtZSA9IFN0cmluZyhuYW1lKVxuICB9XG4gIGlmICgvW15hLXowLTlcXC0jJCUmJyorLl5fYHx+IV0vaS50ZXN0KG5hbWUpIHx8IG5hbWUgPT09ICcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWU6IFwiJyArIG5hbWUgKyAnXCInKVxuICB9XG4gIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKClcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgfVxuICByZXR1cm4gdmFsdWVcbn1cblxuLy8gQnVpbGQgYSBkZXN0cnVjdGl2ZSBpdGVyYXRvciBmb3IgdGhlIHZhbHVlIGxpc3RcbmZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gIHZhciBpdGVyYXRvciA9IHtcbiAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KClcbiAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGl0ZXJhdG9yXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdGhpcy5tYXAgPSB7fVxuXG4gIGlmIChoZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycykge1xuICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpXG4gICAgfSwgdGhpcylcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgdGhpcy5hcHBlbmQoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgfSwgdGhpcylcbiAgfSBlbHNlIGlmIChoZWFkZXJzKSB7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB0aGlzLmFwcGVuZChuYW1lLCBoZWFkZXJzW25hbWVdKVxuICAgIH0sIHRoaXMpXG4gIH1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgdmFsdWUgPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgdmFyIG9sZFZhbHVlID0gdGhpcy5tYXBbbmFtZV1cbiAgdGhpcy5tYXBbbmFtZV0gPSBvbGRWYWx1ZSA/IG9sZFZhbHVlICsgJywgJyArIHZhbHVlIDogdmFsdWVcbn1cblxuSGVhZGVycy5wcm90b3R5cGVbJ2RlbGV0ZSddID0gZnVuY3Rpb24obmFtZSkge1xuICBkZWxldGUgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICByZXR1cm4gdGhpcy5oYXMobmFtZSkgPyB0aGlzLm1hcFtuYW1lXSA6IG51bGxcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xuICByZXR1cm4gdGhpcy5tYXAuaGFzT3duUHJvcGVydHkobm9ybWFsaXplTmFtZShuYW1lKSlcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV0gPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gIGZvciAodmFyIG5hbWUgaW4gdGhpcy5tYXApIHtcbiAgICBpZiAodGhpcy5tYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdGhpcy5tYXBbbmFtZV0sIG5hbWUsIHRoaXMpXG4gICAgfVxuICB9XG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgaXRlbXMucHVzaChuYW1lKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpdGVtcy5wdXNoKHZhbHVlKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgaXRlbXMucHVzaChbbmFtZSwgdmFsdWVdKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbmlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gIEhlYWRlcnMucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzXG59XG5cbmZ1bmN0aW9uIGNvbnN1bWVkKGJvZHkpIHtcbiAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXG4gIH1cbiAgYm9keS5ib2R5VXNlZCA9IHRydWVcbn1cblxuZnVuY3Rpb24gZmlsZVJlYWRlclJlYWR5KHJlYWRlcikge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KVxuICAgIH1cbiAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KHJlYWRlci5lcnJvcilcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSB7XG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gIHJldHVybiBwcm9taXNlXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2IpIHtcbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICByZWFkZXIucmVhZEFzVGV4dChibG9iKVxuICByZXR1cm4gcHJvbWlzZVxufVxuXG5mdW5jdGlvbiByZWFkQXJyYXlCdWZmZXJBc1RleHQoYnVmKSB7XG4gIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICB2YXIgY2hhcnMgPSBuZXcgQXJyYXkodmlldy5sZW5ndGgpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3Lmxlbmd0aDsgaSsrKSB7XG4gICAgY2hhcnNbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZpZXdbaV0pXG4gIH1cbiAgcmV0dXJuIGNoYXJzLmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGJ1ZmZlckNsb25lKGJ1Zikge1xuICBpZiAoYnVmLnNsaWNlKSB7XG4gICAgcmV0dXJuIGJ1Zi5zbGljZSgwKVxuICB9IGVsc2Uge1xuICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmLmJ5dGVMZW5ndGgpXG4gICAgdmlldy5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmKSlcbiAgICByZXR1cm4gdmlldy5idWZmZXJcbiAgfVxufVxuXG5mdW5jdGlvbiBCb2R5KCkge1xuICB0aGlzLmJvZHlVc2VkID0gZmFsc2VcblxuICB0aGlzLl9pbml0Qm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICAvKlxuICAgICAgZmV0Y2gtbW9jayB3cmFwcyB0aGUgUmVzcG9uc2Ugb2JqZWN0IGluIGFuIEVTNiBQcm94eSB0b1xuICAgICAgcHJvdmlkZSB1c2VmdWwgdGVzdCBoYXJuZXNzIGZlYXR1cmVzIHN1Y2ggYXMgZmx1c2guIEhvd2V2ZXIsIG9uXG4gICAgICBFUzUgYnJvd3NlcnMgd2l0aG91dCBmZXRjaCBvciBQcm94eSBzdXBwb3J0IHBvbGx5ZmlsbHMgbXVzdCBiZSB1c2VkO1xuICAgICAgdGhlIHByb3h5LXBvbGx5ZmlsbCBpcyB1bmFibGUgdG8gcHJveHkgYW4gYXR0cmlidXRlIHVubGVzcyBpdCBleGlzdHNcbiAgICAgIG9uIHRoZSBvYmplY3QgYmVmb3JlIHRoZSBQcm94eSBpcyBjcmVhdGVkLiBUaGlzIGNoYW5nZSBlbnN1cmVzXG4gICAgICBSZXNwb25zZS5ib2R5VXNlZCBleGlzdHMgb24gdGhlIGluc3RhbmNlLCB3aGlsZSBtYWludGFpbmluZyB0aGVcbiAgICAgIHNlbWFudGljIG9mIHNldHRpbmcgUmVxdWVzdC5ib2R5VXNlZCBpbiB0aGUgY29uc3RydWN0b3IgYmVmb3JlXG4gICAgICBfaW5pdEJvZHkgaXMgY2FsbGVkLlxuICAgICovXG4gICAgdGhpcy5ib2R5VXNlZCA9IHRoaXMuYm9keVVzZWRcbiAgICB0aGlzLl9ib2R5SW5pdCA9IGJvZHlcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUJsb2IgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpXG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIHN1cHBvcnQuYmxvYiAmJiBpc0RhdGFWaWV3KGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5LmJ1ZmZlcilcbiAgICAgIC8vIElFIDEwLTExIGNhbid0IGhhbmRsZSBhIERhdGFWaWV3IGJvZHkuXG4gICAgICB0aGlzLl9ib2R5SW5pdCA9IG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiAoQXJyYXlCdWZmZXIucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkgfHwgaXNBcnJheUJ1ZmZlclZpZXcoYm9keSkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYm9keSlcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB7XG4gICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QmxvYiAmJiB0aGlzLl9ib2R5QmxvYi50eXBlKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsIHRoaXMuX2JvZHlCbG9iLnR5cGUpXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0LmJsb2IpIHtcbiAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSkpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgYmxvYicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgdmFyIGlzQ29uc3VtZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgICBpZiAoaXNDb25zdW1lZCkge1xuICAgICAgICAgIHJldHVybiBpc0NvbnN1bWVkXG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShcbiAgICAgICAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlci5idWZmZXIuc2xpY2UoXG4gICAgICAgICAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlci5ieXRlT2Zmc2V0LFxuICAgICAgICAgICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIuYnl0ZU9mZnNldCArIHRoaXMuX2JvZHlBcnJheUJ1ZmZlci5ieXRlTGVuZ3RoXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUFycmF5QnVmZmVyKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ibG9iKCkudGhlbihyZWFkQmxvYkFzQXJyYXlCdWZmZXIpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgIHJldHVybiByZWplY3RlZFxuICAgIH1cblxuICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlYWRBcnJheUJ1ZmZlckFzVGV4dCh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgdGV4dCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuZm9ybURhdGEpIHtcbiAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihkZWNvZGUpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5qc29uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oSlNPTi5wYXJzZSlcbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIEhUVFAgbWV0aG9kcyB3aG9zZSBjYXBpdGFsaXphdGlvbiBzaG91bGQgYmUgbm9ybWFsaXplZFxudmFyIG1ldGhvZHMgPSBbJ0RFTEVURScsICdHRVQnLCAnSEVBRCcsICdPUFRJT05TJywgJ1BPU1QnLCAnUFVUJ11cblxuZnVuY3Rpb24gbm9ybWFsaXplTWV0aG9kKG1ldGhvZCkge1xuICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gIHJldHVybiBtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSA/IHVwY2FzZWQgOiBtZXRob2Rcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJlcXVlc3QpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUGxlYXNlIHVzZSB0aGUgXCJuZXdcIiBvcGVyYXRvciwgdGhpcyBET00gb2JqZWN0IGNvbnN0cnVjdG9yIGNhbm5vdCBiZSBjYWxsZWQgYXMgYSBmdW5jdGlvbi4nKVxuICB9XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHlcblxuICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKVxuICAgIH1cbiAgICB0aGlzLnVybCA9IGlucHV0LnVybFxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBpbnB1dC5jcmVkZW50aWFsc1xuICAgIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxuICAgIH1cbiAgICB0aGlzLm1ldGhvZCA9IGlucHV0Lm1ldGhvZFxuICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcbiAgICB0aGlzLnNpZ25hbCA9IGlucHV0LnNpZ25hbFxuICAgIGlmICghYm9keSAmJiBpbnB1dC5fYm9keUluaXQgIT0gbnVsbCkge1xuICAgICAgYm9keSA9IGlucHV0Ll9ib2R5SW5pdFxuICAgICAgaW5wdXQuYm9keVVzZWQgPSB0cnVlXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMudXJsID0gU3RyaW5nKGlucHV0KVxuICB9XG5cbiAgdGhpcy5jcmVkZW50aWFscyA9IG9wdGlvbnMuY3JlZGVudGlhbHMgfHwgdGhpcy5jcmVkZW50aWFscyB8fCAnc2FtZS1vcmlnaW4nXG4gIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xuICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgfVxuICB0aGlzLm1ldGhvZCA9IG5vcm1hbGl6ZU1ldGhvZChvcHRpb25zLm1ldGhvZCB8fCB0aGlzLm1ldGhvZCB8fCAnR0VUJylcbiAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IHRoaXMubW9kZSB8fCBudWxsXG4gIHRoaXMuc2lnbmFsID0gb3B0aW9ucy5zaWduYWwgfHwgdGhpcy5zaWduYWxcbiAgdGhpcy5yZWZlcnJlciA9IG51bGxcblxuICBpZiAoKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSAmJiBib2R5KSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9keSBub3QgYWxsb3dlZCBmb3IgR0VUIG9yIEhFQUQgcmVxdWVzdHMnKVxuICB9XG4gIHRoaXMuX2luaXRCb2R5KGJvZHkpXG5cbiAgaWYgKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSB7XG4gICAgaWYgKG9wdGlvbnMuY2FjaGUgPT09ICduby1zdG9yZScgfHwgb3B0aW9ucy5jYWNoZSA9PT0gJ25vLWNhY2hlJykge1xuICAgICAgLy8gU2VhcmNoIGZvciBhICdfJyBwYXJhbWV0ZXIgaW4gdGhlIHF1ZXJ5IHN0cmluZ1xuICAgICAgdmFyIHJlUGFyYW1TZWFyY2ggPSAvKFs/Jl0pXz1bXiZdKi9cbiAgICAgIGlmIChyZVBhcmFtU2VhcmNoLnRlc3QodGhpcy51cmwpKSB7XG4gICAgICAgIC8vIElmIGl0IGFscmVhZHkgZXhpc3RzIHRoZW4gc2V0IHRoZSB2YWx1ZSB3aXRoIHRoZSBjdXJyZW50IHRpbWVcbiAgICAgICAgdGhpcy51cmwgPSB0aGlzLnVybC5yZXBsYWNlKHJlUGFyYW1TZWFyY2gsICckMV89JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlIGFkZCBhIG5ldyAnXycgcGFyYW1ldGVyIHRvIHRoZSBlbmQgd2l0aCB0aGUgY3VycmVudCB0aW1lXG4gICAgICAgIHZhciByZVF1ZXJ5U3RyaW5nID0gL1xcPy9cbiAgICAgICAgdGhpcy51cmwgKz0gKHJlUXVlcnlTdHJpbmcudGVzdCh0aGlzLnVybCkgPyAnJicgOiAnPycpICsgJ189JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cblJlcXVlc3QucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzLCB7Ym9keTogdGhpcy5fYm9keUluaXR9KVxufVxuXG5mdW5jdGlvbiBkZWNvZGUoYm9keSkge1xuICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpXG4gIGJvZHlcbiAgICAudHJpbSgpXG4gICAgLnNwbGl0KCcmJylcbiAgICAuZm9yRWFjaChmdW5jdGlvbihieXRlcykge1xuICAgICAgaWYgKGJ5dGVzKSB7XG4gICAgICAgIHZhciBzcGxpdCA9IGJ5dGVzLnNwbGl0KCc9JylcbiAgICAgICAgdmFyIG5hbWUgPSBzcGxpdC5zaGlmdCgpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIHZhciB2YWx1ZSA9IHNwbGl0LmpvaW4oJz0nKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICBmb3JtLmFwcGVuZChkZWNvZGVVUklDb21wb25lbnQobmFtZSksIGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXG4gICAgICB9XG4gICAgfSlcbiAgcmV0dXJuIGZvcm1cbn1cblxuZnVuY3Rpb24gcGFyc2VIZWFkZXJzKHJhd0hlYWRlcnMpIHtcbiAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycygpXG4gIC8vIFJlcGxhY2UgaW5zdGFuY2VzIG9mIFxcclxcbiBhbmQgXFxuIGZvbGxvd2VkIGJ5IGF0IGxlYXN0IG9uZSBzcGFjZSBvciBob3Jpem9udGFsIHRhYiB3aXRoIGEgc3BhY2VcbiAgLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzAjc2VjdGlvbi0zLjJcbiAgdmFyIHByZVByb2Nlc3NlZEhlYWRlcnMgPSByYXdIZWFkZXJzLnJlcGxhY2UoL1xccj9cXG5bXFx0IF0rL2csICcgJylcbiAgLy8gQXZvaWRpbmcgc3BsaXQgdmlhIHJlZ2V4IHRvIHdvcmsgYXJvdW5kIGEgY29tbW9uIElFMTEgYnVnIHdpdGggdGhlIGNvcmUtanMgMy42LjAgcmVnZXggcG9seWZpbGxcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2dpdGh1Yi9mZXRjaC9pc3N1ZXMvNzQ4XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy83NTFcbiAgcHJlUHJvY2Vzc2VkSGVhZGVyc1xuICAgIC5zcGxpdCgnXFxyJylcbiAgICAubWFwKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgcmV0dXJuIGhlYWRlci5pbmRleE9mKCdcXG4nKSA9PT0gMCA/IGhlYWRlci5zdWJzdHIoMSwgaGVhZGVyLmxlbmd0aCkgOiBoZWFkZXJcbiAgICB9KVxuICAgIC5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgIHZhciBwYXJ0cyA9IGxpbmUuc3BsaXQoJzonKVxuICAgICAgdmFyIGtleSA9IHBhcnRzLnNoaWZ0KCkudHJpbSgpXG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLmpvaW4oJzonKS50cmltKClcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoa2V5LCB2YWx1ZSlcbiAgICAgIH1cbiAgICB9KVxuICByZXR1cm4gaGVhZGVyc1xufVxuXG5Cb2R5LmNhbGwoUmVxdWVzdC5wcm90b3R5cGUpXG5cbmV4cG9ydCBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUmVzcG9uc2UpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUGxlYXNlIHVzZSB0aGUgXCJuZXdcIiBvcGVyYXRvciwgdGhpcyBET00gb2JqZWN0IGNvbnN0cnVjdG9yIGNhbm5vdCBiZSBjYWxsZWQgYXMgYSBmdW5jdGlvbi4nKVxuICB9XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fVxuICB9XG5cbiAgdGhpcy50eXBlID0gJ2RlZmF1bHQnXG4gIHRoaXMuc3RhdHVzID0gb3B0aW9ucy5zdGF0dXMgPT09IHVuZGVmaW5lZCA/IDIwMCA6IG9wdGlvbnMuc3RhdHVzXG4gIHRoaXMub2sgPSB0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDBcbiAgdGhpcy5zdGF0dXNUZXh0ID0gb3B0aW9ucy5zdGF0dXNUZXh0ID09PSB1bmRlZmluZWQgPyAnJyA6ICcnICsgb3B0aW9ucy5zdGF0dXNUZXh0XG4gIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgdGhpcy51cmwgPSBvcHRpb25zLnVybCB8fCAnJ1xuICB0aGlzLl9pbml0Qm9keShib2R5SW5pdClcbn1cblxuQm9keS5jYWxsKFJlc3BvbnNlLnByb3RvdHlwZSlcblxuUmVzcG9uc2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgUmVzcG9uc2UodGhpcy5fYm9keUluaXQsIHtcbiAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgIHN0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dCxcbiAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh0aGlzLmhlYWRlcnMpLFxuICAgIHVybDogdGhpcy51cmxcbiAgfSlcbn1cblxuUmVzcG9uc2UuZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDAsIHN0YXR1c1RleHQ6ICcnfSlcbiAgcmVzcG9uc2UudHlwZSA9ICdlcnJvcidcbiAgcmV0dXJuIHJlc3BvbnNlXG59XG5cbnZhciByZWRpcmVjdFN0YXR1c2VzID0gWzMwMSwgMzAyLCAzMDMsIDMwNywgMzA4XVxuXG5SZXNwb25zZS5yZWRpcmVjdCA9IGZ1bmN0aW9uKHVybCwgc3RhdHVzKSB7XG4gIGlmIChyZWRpcmVjdFN0YXR1c2VzLmluZGV4T2Yoc3RhdHVzKSA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCBzdGF0dXMgY29kZScpXG4gIH1cblxuICByZXR1cm4gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IHN0YXR1cywgaGVhZGVyczoge2xvY2F0aW9uOiB1cmx9fSlcbn1cblxuZXhwb3J0IHZhciBET01FeGNlcHRpb24gPSBnbG9iYWwuRE9NRXhjZXB0aW9uXG50cnkge1xuICBuZXcgRE9NRXhjZXB0aW9uKClcbn0gY2F0Y2ggKGVycikge1xuICBET01FeGNlcHRpb24gPSBmdW5jdGlvbihtZXNzYWdlLCBuYW1lKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB2YXIgZXJyb3IgPSBFcnJvcihtZXNzYWdlKVxuICAgIHRoaXMuc3RhY2sgPSBlcnJvci5zdGFja1xuICB9XG4gIERPTUV4Y2VwdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSlcbiAgRE9NRXhjZXB0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IERPTUV4Y2VwdGlvblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2goaW5wdXQsIGluaXQpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoaW5wdXQsIGluaXQpXG5cbiAgICBpZiAocmVxdWVzdC5zaWduYWwgJiYgcmVxdWVzdC5zaWduYWwuYWJvcnRlZCkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgRE9NRXhjZXB0aW9uKCdBYm9ydGVkJywgJ0Fib3J0RXJyb3InKSlcbiAgICB9XG5cbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuICAgIGZ1bmN0aW9uIGFib3J0WGhyKCkge1xuICAgICAgeGhyLmFib3J0KClcbiAgICB9XG5cbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSB8fCAnJylcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMudXJsID0gJ3Jlc3BvbnNlVVJMJyBpbiB4aHIgPyB4aHIucmVzcG9uc2VVUkwgOiBvcHRpb25zLmhlYWRlcnMuZ2V0KCdYLVJlcXVlc3QtVVJMJylcbiAgICAgIHZhciBib2R5ID0gJ3Jlc3BvbnNlJyBpbiB4aHIgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSlcbiAgICAgIH0sIDApXG4gICAgfVxuXG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgICB9LCAwKVxuICAgIH1cblxuICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgICB9LCAwKVxuICAgIH1cblxuICAgIHhoci5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IERPTUV4Y2VwdGlvbignQWJvcnRlZCcsICdBYm9ydEVycm9yJykpXG4gICAgICB9LCAwKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpeFVybCh1cmwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiB1cmwgPT09ICcnICYmIGdsb2JhbC5sb2NhdGlvbi5ocmVmID8gZ2xvYmFsLmxvY2F0aW9uLmhyZWYgOiB1cmxcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIHVybFxuICAgICAgfVxuICAgIH1cblxuICAgIHhoci5vcGVuKHJlcXVlc3QubWV0aG9kLCBmaXhVcmwocmVxdWVzdC51cmwpLCB0cnVlKVxuXG4gICAgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdpbmNsdWRlJykge1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICB9IGVsc2UgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdvbWl0Jykge1xuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKCdyZXNwb25zZVR5cGUnIGluIHhocikge1xuICAgICAgaWYgKHN1cHBvcnQuYmxvYikge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InXG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBzdXBwb3J0LmFycmF5QnVmZmVyICYmXG4gICAgICAgIHJlcXVlc3QuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpICYmXG4gICAgICAgIHJlcXVlc3QuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpLmluZGV4T2YoJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScpICE9PSAtMVxuICAgICAgKSB7XG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGluaXQgJiYgdHlwZW9mIGluaXQuaGVhZGVycyA9PT0gJ29iamVjdCcgJiYgIShpbml0LmhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzKSkge1xuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaW5pdC5oZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgbm9ybWFsaXplVmFsdWUoaW5pdC5oZWFkZXJzW25hbWVdKSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAocmVxdWVzdC5zaWduYWwpIHtcbiAgICAgIHJlcXVlc3Quc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRYaHIpXG5cbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gRE9ORSAoc3VjY2VzcyBvciBmYWlsdXJlKVxuICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICByZXF1ZXN0LnNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0WGhyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdClcbiAgfSlcbn1cblxuZmV0Y2gucG9seWZpbGwgPSB0cnVlXG5cbmlmICghZ2xvYmFsLmZldGNoKSB7XG4gIGdsb2JhbC5mZXRjaCA9IGZldGNoXG4gIGdsb2JhbC5IZWFkZXJzID0gSGVhZGVyc1xuICBnbG9iYWwuUmVxdWVzdCA9IFJlcXVlc3RcbiAgZ2xvYmFsLlJlc3BvbnNlID0gUmVzcG9uc2Vcbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmaW5lZCxuby1wYXJhbS1yZWFzc2lnbixuby1zaGFkb3cgKi9cblxuLyoqXG4gKiBUaHJvdHRsZSBleGVjdXRpb24gb2YgYSBmdW5jdGlvbi4gRXNwZWNpYWxseSB1c2VmdWwgZm9yIHJhdGUgbGltaXRpbmdcbiAqIGV4ZWN1dGlvbiBvZiBoYW5kbGVycyBvbiBldmVudHMgbGlrZSByZXNpemUgYW5kIHNjcm9sbC5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gZGVsYXkgLSAgICAgICAgICAgICAgICAgIEEgemVyby1vci1ncmVhdGVyIGRlbGF5IGluIG1pbGxpc2Vjb25kcy4gRm9yIGV2ZW50IGNhbGxiYWNrcywgdmFsdWVzIGFyb3VuZCAxMDAgb3IgMjUwIChvciBldmVuIGhpZ2hlcilcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmUgbW9zdCB1c2VmdWwuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtICAgICAgICAgICAgICAgQSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBhZnRlciBkZWxheSBtaWxsaXNlY29uZHMuIFRoZSBgdGhpc2AgY29udGV4dCBhbmQgYWxsIGFyZ3VtZW50cyBhcmUgcGFzc2VkIHRocm91Z2gsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXMtaXMsIHRvIGBjYWxsYmFja2Agd2hlbiB0aGUgdGhyb3R0bGVkLWZ1bmN0aW9uIGlzIGV4ZWN1dGVkLlxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSAtICAgICAgICAgICAgICBBbiBvYmplY3QgdG8gY29uZmlndXJlIG9wdGlvbnMuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLm5vVHJhaWxpbmddIC0gICBPcHRpb25hbCwgZGVmYXVsdHMgdG8gZmFsc2UuIElmIG5vVHJhaWxpbmcgaXMgdHJ1ZSwgY2FsbGJhY2sgd2lsbCBvbmx5IGV4ZWN1dGUgZXZlcnkgYGRlbGF5YCBtaWxsaXNlY29uZHNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSB0aGUgdGhyb3R0bGVkLWZ1bmN0aW9uIGlzIGJlaW5nIGNhbGxlZC4gSWYgbm9UcmFpbGluZyBpcyBmYWxzZSBvciB1bnNwZWNpZmllZCwgY2FsbGJhY2sgd2lsbCBiZSBleGVjdXRlZFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uZSBmaW5hbCB0aW1lIGFmdGVyIHRoZSBsYXN0IHRocm90dGxlZC1mdW5jdGlvbiBjYWxsLiAoQWZ0ZXIgdGhlIHRocm90dGxlZC1mdW5jdGlvbiBoYXMgbm90IGJlZW4gY2FsbGVkIGZvclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBkZWxheWAgbWlsbGlzZWNvbmRzLCB0aGUgaW50ZXJuYWwgY291bnRlciBpcyByZXNldCkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLm5vTGVhZGluZ10gLSAgIE9wdGlvbmFsLCBkZWZhdWx0cyB0byBmYWxzZS4gSWYgbm9MZWFkaW5nIGlzIGZhbHNlLCB0aGUgZmlyc3QgdGhyb3R0bGVkLWZ1bmN0aW9uIGNhbGwgd2lsbCBleGVjdXRlIGNhbGxiYWNrXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1tZWRpYXRlbHkuIElmIG5vTGVhZGluZyBpcyB0cnVlLCB0aGUgZmlyc3QgdGhlIGNhbGxiYWNrIGV4ZWN1dGlvbiB3aWxsIGJlIHNraXBwZWQuIEl0IHNob3VsZCBiZSBub3RlZCB0aGF0XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgd2lsbCBuZXZlciBleGVjdXRlZCBpZiBib3RoIG5vTGVhZGluZyA9IHRydWUgYW5kIG5vVHJhaWxpbmcgPSB0cnVlLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5kZWJvdW5jZU1vZGVdIC0gSWYgYGRlYm91bmNlTW9kZWAgaXMgdHJ1ZSAoYXQgYmVnaW4pLCBzY2hlZHVsZSBgY2xlYXJgIHRvIGV4ZWN1dGUgYWZ0ZXIgYGRlbGF5YCBtcy4gSWYgYGRlYm91bmNlTW9kZWAgaXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSAoYXQgZW5kKSwgc2NoZWR1bGUgYGNhbGxiYWNrYCB0byBleGVjdXRlIGFmdGVyIGBkZWxheWAgbXMuXG4gKlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBBIG5ldywgdGhyb3R0bGVkLCBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGRlbGF5LCBjYWxsYmFjaywgb3B0aW9ucykge1xuXHRjb25zdCB7XG5cdFx0bm9UcmFpbGluZyA9IGZhbHNlLFxuXHRcdG5vTGVhZGluZyA9IGZhbHNlLFxuXHRcdGRlYm91bmNlTW9kZSA9IHVuZGVmaW5lZFxuXHR9ID0gb3B0aW9ucyB8fCB7fTtcblx0Lypcblx0ICogQWZ0ZXIgd3JhcHBlciBoYXMgc3RvcHBlZCBiZWluZyBjYWxsZWQsIHRoaXMgdGltZW91dCBlbnN1cmVzIHRoYXRcblx0ICogYGNhbGxiYWNrYCBpcyBleGVjdXRlZCBhdCB0aGUgcHJvcGVyIHRpbWVzIGluIGB0aHJvdHRsZWAgYW5kIGBlbmRgXG5cdCAqIGRlYm91bmNlIG1vZGVzLlxuXHQgKi9cblx0bGV0IHRpbWVvdXRJRDtcblx0bGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuXG5cdC8vIEtlZXAgdHJhY2sgb2YgdGhlIGxhc3QgdGltZSBgY2FsbGJhY2tgIHdhcyBleGVjdXRlZC5cblx0bGV0IGxhc3RFeGVjID0gMDtcblxuXHQvLyBGdW5jdGlvbiB0byBjbGVhciBleGlzdGluZyB0aW1lb3V0XG5cdGZ1bmN0aW9uIGNsZWFyRXhpc3RpbmdUaW1lb3V0KCkge1xuXHRcdGlmICh0aW1lb3V0SUQpIHtcblx0XHRcdGNsZWFyVGltZW91dCh0aW1lb3V0SUQpO1xuXHRcdH1cblx0fVxuXG5cdC8vIEZ1bmN0aW9uIHRvIGNhbmNlbCBuZXh0IGV4ZWNcblx0ZnVuY3Rpb24gY2FuY2VsKG9wdGlvbnMpIHtcblx0XHRjb25zdCB7IHVwY29taW5nT25seSA9IGZhbHNlIH0gPSBvcHRpb25zIHx8IHt9O1xuXHRcdGNsZWFyRXhpc3RpbmdUaW1lb3V0KCk7XG5cdFx0Y2FuY2VsbGVkID0gIXVwY29taW5nT25seTtcblx0fVxuXG5cdC8qXG5cdCAqIFRoZSBgd3JhcHBlcmAgZnVuY3Rpb24gZW5jYXBzdWxhdGVzIGFsbCBvZiB0aGUgdGhyb3R0bGluZyAvIGRlYm91bmNpbmdcblx0ICogZnVuY3Rpb25hbGl0eSBhbmQgd2hlbiBleGVjdXRlZCB3aWxsIGxpbWl0IHRoZSByYXRlIGF0IHdoaWNoIGBjYWxsYmFja2Bcblx0ICogaXMgZXhlY3V0ZWQuXG5cdCAqL1xuXHRmdW5jdGlvbiB3cmFwcGVyKC4uLmFyZ3VtZW50c18pIHtcblx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cdFx0bGV0IGVsYXBzZWQgPSBEYXRlLm5vdygpIC0gbGFzdEV4ZWM7XG5cblx0XHRpZiAoY2FuY2VsbGVkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gRXhlY3V0ZSBgY2FsbGJhY2tgIGFuZCB1cGRhdGUgdGhlIGBsYXN0RXhlY2AgdGltZXN0YW1wLlxuXHRcdGZ1bmN0aW9uIGV4ZWMoKSB7XG5cdFx0XHRsYXN0RXhlYyA9IERhdGUubm93KCk7XG5cdFx0XHRjYWxsYmFjay5hcHBseShzZWxmLCBhcmd1bWVudHNfKTtcblx0XHR9XG5cblx0XHQvKlxuXHRcdCAqIElmIGBkZWJvdW5jZU1vZGVgIGlzIHRydWUgKGF0IGJlZ2luKSB0aGlzIGlzIHVzZWQgdG8gY2xlYXIgdGhlIGZsYWdcblx0XHQgKiB0byBhbGxvdyBmdXR1cmUgYGNhbGxiYWNrYCBleGVjdXRpb25zLlxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGNsZWFyKCkge1xuXHRcdFx0dGltZW91dElEID0gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdGlmICghbm9MZWFkaW5nICYmIGRlYm91bmNlTW9kZSAmJiAhdGltZW91dElEKSB7XG5cdFx0XHQvKlxuXHRcdFx0ICogU2luY2UgYHdyYXBwZXJgIGlzIGJlaW5nIGNhbGxlZCBmb3IgdGhlIGZpcnN0IHRpbWUgYW5kXG5cdFx0XHQgKiBgZGVib3VuY2VNb2RlYCBpcyB0cnVlIChhdCBiZWdpbiksIGV4ZWN1dGUgYGNhbGxiYWNrYFxuXHRcdFx0ICogYW5kIG5vTGVhZGluZyAhPSB0cnVlLlxuXHRcdFx0ICovXG5cdFx0XHRleGVjKCk7XG5cdFx0fVxuXG5cdFx0Y2xlYXJFeGlzdGluZ1RpbWVvdXQoKTtcblxuXHRcdGlmIChkZWJvdW5jZU1vZGUgPT09IHVuZGVmaW5lZCAmJiBlbGFwc2VkID4gZGVsYXkpIHtcblx0XHRcdGlmIChub0xlYWRpbmcpIHtcblx0XHRcdFx0Lypcblx0XHRcdFx0ICogSW4gdGhyb3R0bGUgbW9kZSB3aXRoIG5vTGVhZGluZywgaWYgYGRlbGF5YCB0aW1lIGhhc1xuXHRcdFx0XHQgKiBiZWVuIGV4Y2VlZGVkLCB1cGRhdGUgYGxhc3RFeGVjYCBhbmQgc2NoZWR1bGUgYGNhbGxiYWNrYFxuXHRcdFx0XHQgKiB0byBleGVjdXRlIGFmdGVyIGBkZWxheWAgbXMuXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRsYXN0RXhlYyA9IERhdGUubm93KCk7XG5cdFx0XHRcdGlmICghbm9UcmFpbGluZykge1xuXHRcdFx0XHRcdHRpbWVvdXRJRCA9IHNldFRpbWVvdXQoZGVib3VuY2VNb2RlID8gY2xlYXIgOiBleGVjLCBkZWxheSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8qXG5cdFx0XHRcdCAqIEluIHRocm90dGxlIG1vZGUgd2l0aG91dCBub0xlYWRpbmcsIGlmIGBkZWxheWAgdGltZSBoYXMgYmVlbiBleGNlZWRlZCwgZXhlY3V0ZVxuXHRcdFx0XHQgKiBgY2FsbGJhY2tgLlxuXHRcdFx0XHQgKi9cblx0XHRcdFx0ZXhlYygpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAobm9UcmFpbGluZyAhPT0gdHJ1ZSkge1xuXHRcdFx0Lypcblx0XHRcdCAqIEluIHRyYWlsaW5nIHRocm90dGxlIG1vZGUsIHNpbmNlIGBkZWxheWAgdGltZSBoYXMgbm90IGJlZW5cblx0XHRcdCAqIGV4Y2VlZGVkLCBzY2hlZHVsZSBgY2FsbGJhY2tgIHRvIGV4ZWN1dGUgYGRlbGF5YCBtcyBhZnRlciBtb3N0XG5cdFx0XHQgKiByZWNlbnQgZXhlY3V0aW9uLlxuXHRcdFx0ICpcblx0XHRcdCAqIElmIGBkZWJvdW5jZU1vZGVgIGlzIHRydWUgKGF0IGJlZ2luKSwgc2NoZWR1bGUgYGNsZWFyYCB0byBleGVjdXRlXG5cdFx0XHQgKiBhZnRlciBgZGVsYXlgIG1zLlxuXHRcdFx0ICpcblx0XHRcdCAqIElmIGBkZWJvdW5jZU1vZGVgIGlzIGZhbHNlIChhdCBlbmQpLCBzY2hlZHVsZSBgY2FsbGJhY2tgIHRvXG5cdFx0XHQgKiBleGVjdXRlIGFmdGVyIGBkZWxheWAgbXMuXG5cdFx0XHQgKi9cblx0XHRcdHRpbWVvdXRJRCA9IHNldFRpbWVvdXQoXG5cdFx0XHRcdGRlYm91bmNlTW9kZSA/IGNsZWFyIDogZXhlYyxcblx0XHRcdFx0ZGVib3VuY2VNb2RlID09PSB1bmRlZmluZWQgPyBkZWxheSAtIGVsYXBzZWQgOiBkZWxheVxuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHR3cmFwcGVyLmNhbmNlbCA9IGNhbmNlbDtcblxuXHQvLyBSZXR1cm4gdGhlIHdyYXBwZXIgZnVuY3Rpb24uXG5cdHJldHVybiB3cmFwcGVyO1xufVxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWZpbmVkICovXG5cbmltcG9ydCB0aHJvdHRsZSBmcm9tICcuL3Rocm90dGxlLmpzJztcblxuLyoqXG4gKiBEZWJvdW5jZSBleGVjdXRpb24gb2YgYSBmdW5jdGlvbi4gRGVib3VuY2luZywgdW5saWtlIHRocm90dGxpbmcsXG4gKiBndWFyYW50ZWVzIHRoYXQgYSBmdW5jdGlvbiBpcyBvbmx5IGV4ZWN1dGVkIGEgc2luZ2xlIHRpbWUsIGVpdGhlciBhdCB0aGVcbiAqIHZlcnkgYmVnaW5uaW5nIG9mIGEgc2VyaWVzIG9mIGNhbGxzLCBvciBhdCB0aGUgdmVyeSBlbmQuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGRlbGF5IC0gICAgICAgICAgICAgICBBIHplcm8tb3ItZ3JlYXRlciBkZWxheSBpbiBtaWxsaXNlY29uZHMuIEZvciBldmVudCBjYWxsYmFja3MsIHZhbHVlcyBhcm91bmQgMTAwIG9yIDI1MCAob3IgZXZlbiBoaWdoZXIpIGFyZSBtb3N0IHVzZWZ1bC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gICAgICAgICAgQSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBhZnRlciBkZWxheSBtaWxsaXNlY29uZHMuIFRoZSBgdGhpc2AgY29udGV4dCBhbmQgYWxsIGFyZ3VtZW50cyBhcmUgcGFzc2VkIHRocm91Z2gsIGFzLWlzLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYGNhbGxiYWNrYCB3aGVuIHRoZSBkZWJvdW5jZWQtZnVuY3Rpb24gaXMgZXhlY3V0ZWQuXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIC0gICAgICAgICAgIEFuIG9iamVjdCB0byBjb25maWd1cmUgb3B0aW9ucy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuYXRCZWdpbl0gLSAgT3B0aW9uYWwsIGRlZmF1bHRzIHRvIGZhbHNlLiBJZiBhdEJlZ2luIGlzIGZhbHNlIG9yIHVuc3BlY2lmaWVkLCBjYWxsYmFjayB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgYGRlbGF5YCBtaWxsaXNlY29uZHNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyIHRoZSBsYXN0IGRlYm91bmNlZC1mdW5jdGlvbiBjYWxsLiBJZiBhdEJlZ2luIGlzIHRydWUsIGNhbGxiYWNrIHdpbGwgYmUgZXhlY3V0ZWQgb25seSBhdCB0aGUgZmlyc3QgZGVib3VuY2VkLWZ1bmN0aW9uIGNhbGwuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoQWZ0ZXIgdGhlIHRocm90dGxlZC1mdW5jdGlvbiBoYXMgbm90IGJlZW4gY2FsbGVkIGZvciBgZGVsYXlgIG1pbGxpc2Vjb25kcywgdGhlIGludGVybmFsIGNvdW50ZXIgaXMgcmVzZXQpLlxuICpcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBuZXcsIGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGRlbGF5LCBjYWxsYmFjaywgb3B0aW9ucykge1xuXHRjb25zdCB7IGF0QmVnaW4gPSBmYWxzZSB9ID0gb3B0aW9ucyB8fCB7fTtcblx0cmV0dXJuIHRocm90dGxlKGRlbGF5LCBjYWxsYmFjaywgeyBkZWJvdW5jZU1vZGU6IGF0QmVnaW4gIT09IGZhbHNlIH0pO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gJ3Rocm90dGxlLWRlYm91bmNlJ1xuaW1wb3J0ICd3aGF0d2ctZmV0Y2gnXG5cbmNvbnN0IGlzVmlzaWJsZSA9IGVsZW0gPT4gISFlbGVtICYmICEhKCBlbGVtLm9mZnNldFdpZHRoIHx8IGVsZW0ub2Zmc2V0SGVpZ2h0IHx8IGVsZW0uZ2V0Q2xpZW50UmVjdHMoKS5sZW5ndGggKVxuXG5jb25zdCBzY2hlZHVsZUl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb24tc2NoZWR1bGVfX2l0ZW0nKVxuaWYgKHNjaGVkdWxlSXRlbXMubGVuZ3RoKSB7XG4gIGxldCBtYXhXaWR0aCA9IDBcbiAgc2NoZWR1bGVJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGlmIChpdGVtLm9mZnNldFdpZHRoID4gbWF4V2lkdGgpIHtcbiAgICAgIG1heFdpZHRoID0gaXRlbS5vZmZzZXRXaWR0aFxuICAgIH1cbiAgfSlcbiAgc2NoZWR1bGVJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGl0ZW0uc3R5bGUud2lkdGggPSBgJHttYXhXaWR0aH1weGBcbiAgfSlcbn1cblxuY29uc3QgYWNjb3JkaW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWFjY29yZGlvbl0nKVxuaWYgKGFjY29yZGlvbnMubGVuZ3RoKSB7XG4gIGFjY29yZGlvbnMuZm9yRWFjaChhY2NvcmRpb24gPT4ge1xuICAgIGNvbnN0IHJvd3MgPSBhY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtYWNjb3JkaW9uLXJvd10nKSB8fCBbXVxuXG4gICAgcm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICBjb25zdCBoZWFkZXIgPSByb3cucXVlcnlTZWxlY3RvcignW2RhdGEtYWNjb3JkaW9uLWhlYWRlcl0nKVxuICAgICAgY29uc3QgY29udGVudCA9IHJvdy5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hY2NvcmRpb24tY29udGVudF0nKVxuXG4gICAgICBjb25zdCB0b2dnbGUgPSAoKSA9PiB7XG4gICAgICAgIGlmIChjb250ZW50LnN0eWxlLm1heEhlaWdodCkge1xuICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdfYWN0aXZlJylcbiAgICAgICAgICBjb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ19hY3RpdmUnKVxuICAgICAgICAgIGNvbnRlbnQuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdfYWN0aXZlJylcbiAgICAgICAgICBjb250ZW50LmNsYXNzTGlzdC5hZGQoJ19hY3RpdmUnKVxuICAgICAgICAgIGNvbnRlbnQuc3R5bGUubWF4SGVpZ2h0ID0gY29udGVudC5zY3JvbGxIZWlnaHQgKyAncHgnXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlKVxuICAgIH0pXG4gIH0pXG59XG5cbmNvbnN0IG1vZGFsVG9nZ2xlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1vZGFsLXRvZ2dsZV0nKVxuaWYgKG1vZGFsVG9nZ2xlcy5sZW5ndGgpIHtcbiAgbW9kYWxUb2dnbGVzLmZvckVhY2godG9nZ2xlID0+IHtcbiAgICBsZXQgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRvZ2dsZS5kYXRhc2V0Lm1vZGFsVG9nZ2xlKVxuICAgIGxldCBjbG9zZSA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW1vZGFsLWNsb3NlXScpXG4gICAgY29uc3Qgb3V0c2lkZUNsaWNrTGlzdGVuZXIgPSBldmVudCA9PiB7XG4gICAgICBpZiAoIW1vZGFsLmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgJiYgaXNWaXNpYmxlKG1vZGFsKSAmJiAhdG9nZ2xlLmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgICAgaGlkZSgpXG4gICAgICAgIHJlbW92ZUNsaWNrTGlzdGVuZXIoKVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZW1vdmVDbGlja0xpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvdXRzaWRlQ2xpY2tMaXN0ZW5lcilcbiAgICB9XG4gICAgY29uc3Qgc2hvdyA9ICgpID0+IHtcbiAgICAgIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ19vcGVuZWQnKVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvdXRzaWRlQ2xpY2tMaXN0ZW5lcilcbiAgICB9XG4gICAgY29uc3QgaGlkZSA9ICgpID0+IHtcbiAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoJ19vcGVuZWQnKVxuICAgIH1cbiAgICB0b2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgc2hvdygpXG4gICAgfSlcbiAgICBjbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBoaWRlKClcbiAgICB9KVxuICB9KVxufVxuXG5jb25zdCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJylcbmNvbnN0IHNjcm9sbHVwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNjcm9sbHVwJylcbmNvbnN0IHNjcm9sbEhhbmRsZXIgPSB0aHJvdHRsZSgxMCwgKCkgPT4ge1xuICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID4gMjApIHtcbiAgICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgnaGVhZGVyX2ZpeGVkJylcbiAgfSBlbHNlIHtcbiAgICBoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZGVyX2ZpeGVkJylcbiAgfVxuXG4gIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgPiA0MDApIHtcbiAgICBzY3JvbGx1cC5jbGFzc0xpc3QuYWRkKCdzY3JvbGx1cF9maXhlZCcpXG4gIH0gZWxzZSB7XG4gICAgc2Nyb2xsdXAuY2xhc3NMaXN0LnJlbW92ZSgnc2Nyb2xsdXBfZml4ZWQnKVxuICB9XG59KVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc2Nyb2xsSGFuZGxlcilcblxuY29uc3Qgc2Nyb2xscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXNjcm9sbF0nKSB8fCBbXVxuc2Nyb2xscy5mb3JFYWNoKHNjcm9sbCA9PiBzY3JvbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgbGV0IG9mZnNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKS5vZmZzZXRIZWlnaHRcbiAgbGV0IHRvcCA9IDBcbiAgbGV0IGxlZnQgPSAwXG4gIGlmIChzY3JvbGwuZGF0YXNldC5zY3JvbGwpIHtcbiAgICBsZXQgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzY3JvbGwuZGF0YXNldC5zY3JvbGwpXG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgdG9wID0gdGFyZ2V0Lm9mZnNldFRvcCAtIG9mZnNldFxuICAgIH1cbiAgfVxuXG4gIHdpbmRvdy5zY3JvbGwoe1xuICAgIHRvcCxcbiAgICBsZWZ0LFxuICAgIGJlaGF2aW9yOiAnc21vb3RoJ1xuICB9KVxufSkpXG5cbmNvbnN0IG1lbnVUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX190b2dnbGUnKVxuY29uc3QgbWVudUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19tZW51Jylcbm1lbnVUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGlmIChtZW51TGlzdC5jbGFzc0xpc3QuY29udGFpbnMoJ19hY3RpdmUnKSkge1xuICAgIG1lbnVMaXN0LmNsYXNzTGlzdC5yZW1vdmUoJ19hY3RpdmUnKVxuICB9IGVsc2Uge1xuICAgIG1lbnVMaXN0LmNsYXNzTGlzdC5hZGQoJ19hY3RpdmUnKVxuICB9XG4gIGlmIChtZW51VG9nZ2xlLmNsYXNzTGlzdC5jb250YWlucygnX2FjdGl2ZScpKSB7XG4gICAgbWVudVRvZ2dsZS5jbGFzc0xpc3QucmVtb3ZlKCdfYWN0aXZlJylcbiAgfSBlbHNlIHtcbiAgICBtZW51VG9nZ2xlLmNsYXNzTGlzdC5hZGQoJ19hY3RpdmUnKVxuICB9XG59KVxuXG5jb25zdCByZW1vdmVGb2N1c2FibGVMaXN0ZW5lciA9ICgpID0+IHtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtZm9jdXNhYmxlJylcbiAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZW1vdmVGb2N1c2FibGVMaXN0ZW5lcilcbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbiAoZSkge1xuICBpZiAoZS5rZXlDb2RlID09PSA5KSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLmNsYXNzTGlzdC5hZGQoJ3BhZ2UtZm9jdXNhYmxlJylcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJlbW92ZUZvY3VzYWJsZUxpc3RlbmVyKVxuICB9XG59LCBmYWxzZSlcblxuY29uc3QgZm9ybXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1mcm9tXScpIHx8IFtdXG5mb3Jtcy5mb3JFYWNoKGZvcm0gPT4ge1xuICBjb25zdCBtZXNzYWdlc0NvbnRhaW5lciA9IGZvcm0ucXVlcnlTZWxlY3RvcignW2RhdGEtZnJvbS1tZXNzYWdlc10nKSB8fCBmb3JtXG5cbiAgbGV0IG1lc3NhZ2VzID0gbmV3IFNldCgpXG5cbiAgY29uc3Qgc2hvd01lc3NhZ2UgPSAodGV4dCwgbW9kZSwgZGVsYXkpID0+IHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgZWwuY2xhc3NMaXN0LmFkZCgndWktZm9ybS1tZXNzYWdlJylcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCd1aS1mb3JtLW1lc3NhZ2VfJyArIG1vZGUpXG4gICAgZWwuaW5uZXJIVE1MID0gdGV4dFxuICAgIGNvbnN0IGNsb3NlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcbiAgICBjbG9zZS5jbGFzc0xpc3QuYWRkKCd1aS1mb3JtLW1lc3NhZ2VfX2Nsb3NlJylcbiAgICBjbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgbWVzc2FnZXMuZGVsZXRlKGVsKVxuICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbClcbiAgICB9KVxuICAgIGVsLmFwcGVuZENoaWxkKGNsb3NlKVxuICAgIG1lc3NhZ2VzQ29udGFpbmVyLmFwcGVuZENoaWxkKGVsKVxuXG4gICAgbWVzc2FnZXMuYWRkKGVsKVxuXG4gICAgaWYgKGRlbGF5KSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgbWVzc2FnZXMuZGVsZXRlKGVsKVxuICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKVxuICAgICAgfSwgZGVsYXkpXG4gICAgfVxuICB9XG5cbiAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBmb3IgKGxldCBtZXNzYWdlIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBtZXNzYWdlcy5kZWxldGUobWVzc2FnZSlcbiAgICAgIG1lc3NhZ2UucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChtZXNzYWdlKVxuICAgIH1cblxuICAgIGZldGNoKGZvcm0uYWN0aW9uLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHk6IG5ldyBGb3JtRGF0YShmb3JtKVxuICAgIH0pXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgIGZvcm0ucmVzZXQoKVxuICAgICAgICBzaG93TWVzc2FnZSgn0KHQvtC+0LHRidC10L3QuNC1INGD0YHQv9C10YjQvdC+INC+0YLQv9GA0LDQstC70LXQvdC+JywgJ3N1Y2Nlc3MnLCA4MDAwKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2hvd01lc3NhZ2UoJ9CSINGE0L7RgNC80LUg0L/RgNC40YHRg9GC0YHRgtCy0YPRjtGCINC+0YjQuNCx0LrQuCcsICdlcnJvcicpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcbn0pXG4iXSwibmFtZXMiOlsiZ2xvYmFsIiwiZ2xvYmFsVGhpcyIsInNlbGYiLCJzdXBwb3J0Iiwic2VhcmNoUGFyYW1zIiwiaXRlcmFibGUiLCJTeW1ib2wiLCJibG9iIiwiQmxvYiIsImUiLCJmb3JtRGF0YSIsImFycmF5QnVmZmVyIiwiaXNEYXRhVmlldyIsIm9iaiIsIkRhdGFWaWV3IiwicHJvdG90eXBlIiwiaXNQcm90b3R5cGVPZiIsInZpZXdDbGFzc2VzIiwiaXNBcnJheUJ1ZmZlclZpZXciLCJBcnJheUJ1ZmZlciIsImlzVmlldyIsImluZGV4T2YiLCJPYmplY3QiLCJ0b1N0cmluZyIsImNhbGwiLCJub3JtYWxpemVOYW1lIiwibmFtZSIsIlN0cmluZyIsInRlc3QiLCJUeXBlRXJyb3IiLCJ0b0xvd2VyQ2FzZSIsIm5vcm1hbGl6ZVZhbHVlIiwidmFsdWUiLCJpdGVyYXRvckZvciIsIml0ZW1zIiwiaXRlcmF0b3IiLCJuZXh0Iiwic2hpZnQiLCJkb25lIiwidW5kZWZpbmVkIiwiSGVhZGVycyIsImhlYWRlcnMiLCJtYXAiLCJmb3JFYWNoIiwiYXBwZW5kIiwiQXJyYXkiLCJpc0FycmF5IiwiaGVhZGVyIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsIm9sZFZhbHVlIiwiZ2V0IiwiaGFzIiwiaGFzT3duUHJvcGVydHkiLCJzZXQiLCJjYWxsYmFjayIsInRoaXNBcmciLCJrZXlzIiwicHVzaCIsInZhbHVlcyIsImVudHJpZXMiLCJjb25zdW1lZCIsImJvZHkiLCJib2R5VXNlZCIsIlByb21pc2UiLCJyZWplY3QiLCJmaWxlUmVhZGVyUmVhZHkiLCJyZWFkZXIiLCJyZXNvbHZlIiwib25sb2FkIiwicmVzdWx0Iiwib25lcnJvciIsImVycm9yIiwicmVhZEJsb2JBc0FycmF5QnVmZmVyIiwiRmlsZVJlYWRlciIsInByb21pc2UiLCJyZWFkQXNBcnJheUJ1ZmZlciIsInJlYWRCbG9iQXNUZXh0IiwicmVhZEFzVGV4dCIsInJlYWRBcnJheUJ1ZmZlckFzVGV4dCIsImJ1ZiIsInZpZXciLCJVaW50OEFycmF5IiwiY2hhcnMiLCJsZW5ndGgiLCJpIiwiZnJvbUNoYXJDb2RlIiwiam9pbiIsImJ1ZmZlckNsb25lIiwic2xpY2UiLCJieXRlTGVuZ3RoIiwiYnVmZmVyIiwiQm9keSIsIl9pbml0Qm9keSIsIl9ib2R5SW5pdCIsIl9ib2R5VGV4dCIsIl9ib2R5QmxvYiIsIkZvcm1EYXRhIiwiX2JvZHlGb3JtRGF0YSIsIlVSTFNlYXJjaFBhcmFtcyIsIl9ib2R5QXJyYXlCdWZmZXIiLCJ0eXBlIiwicmVqZWN0ZWQiLCJFcnJvciIsImlzQ29uc3VtZWQiLCJieXRlT2Zmc2V0IiwidGhlbiIsInRleHQiLCJkZWNvZGUiLCJqc29uIiwiSlNPTiIsInBhcnNlIiwibWV0aG9kcyIsIm5vcm1hbGl6ZU1ldGhvZCIsIm1ldGhvZCIsInVwY2FzZWQiLCJ0b1VwcGVyQ2FzZSIsIlJlcXVlc3QiLCJpbnB1dCIsIm9wdGlvbnMiLCJ1cmwiLCJjcmVkZW50aWFscyIsIm1vZGUiLCJzaWduYWwiLCJyZWZlcnJlciIsImNhY2hlIiwicmVQYXJhbVNlYXJjaCIsInJlcGxhY2UiLCJEYXRlIiwiZ2V0VGltZSIsInJlUXVlcnlTdHJpbmciLCJjbG9uZSIsImZvcm0iLCJ0cmltIiwic3BsaXQiLCJieXRlcyIsImRlY29kZVVSSUNvbXBvbmVudCIsInBhcnNlSGVhZGVycyIsInJhd0hlYWRlcnMiLCJwcmVQcm9jZXNzZWRIZWFkZXJzIiwic3Vic3RyIiwibGluZSIsInBhcnRzIiwia2V5IiwiUmVzcG9uc2UiLCJib2R5SW5pdCIsInN0YXR1cyIsIm9rIiwic3RhdHVzVGV4dCIsInJlc3BvbnNlIiwicmVkaXJlY3RTdGF0dXNlcyIsInJlZGlyZWN0IiwiUmFuZ2VFcnJvciIsImxvY2F0aW9uIiwiRE9NRXhjZXB0aW9uIiwiZXJyIiwibWVzc2FnZSIsInN0YWNrIiwiY3JlYXRlIiwiY29uc3RydWN0b3IiLCJmZXRjaCIsImluaXQiLCJyZXF1ZXN0IiwiYWJvcnRlZCIsInhociIsIlhNTEh0dHBSZXF1ZXN0IiwiYWJvcnRYaHIiLCJhYm9ydCIsImdldEFsbFJlc3BvbnNlSGVhZGVycyIsInJlc3BvbnNlVVJMIiwicmVzcG9uc2VUZXh0Iiwic2V0VGltZW91dCIsIm9udGltZW91dCIsIm9uYWJvcnQiLCJmaXhVcmwiLCJocmVmIiwib3BlbiIsIndpdGhDcmVkZW50aWFscyIsInJlc3BvbnNlVHlwZSIsInNldFJlcXVlc3RIZWFkZXIiLCJhZGRFdmVudExpc3RlbmVyIiwib25yZWFkeXN0YXRlY2hhbmdlIiwicmVhZHlTdGF0ZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJzZW5kIiwicG9seWZpbGwiLCJkZWxheSIsIl9yZWYkbm9UcmFpbGluZyIsIm5vVHJhaWxpbmciLCJfcmVmJG5vTGVhZGluZyIsIm5vTGVhZGluZyIsIl9yZWYkZGVib3VuY2VNb2RlIiwiZGVib3VuY2VNb2RlIiwidGltZW91dElEIiwiY2FuY2VsbGVkIiwibGFzdEV4ZWMiLCJjbGVhckV4aXN0aW5nVGltZW91dCIsImNsZWFyVGltZW91dCIsImNhbmNlbCIsIl9yZWYyJHVwY29taW5nT25seSIsInVwY29taW5nT25seSIsIndyYXBwZXIiLCJhcmd1bWVudHNfIiwiYXJndW1lbnRzIiwiZWxhcHNlZCIsIm5vdyIsImV4ZWMiLCJhcHBseSIsImNsZWFyIiwiX3JlZiRhdEJlZ2luIiwiYXRCZWdpbiIsInRocm90dGxlIiwiaXNWaXNpYmxlIiwiZWxlbSIsIm9mZnNldFdpZHRoIiwib2Zmc2V0SGVpZ2h0IiwiZ2V0Q2xpZW50UmVjdHMiLCJzY2hlZHVsZUl0ZW1zIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwibWF4V2lkdGgiLCJpdGVtIiwic3R5bGUiLCJ3aWR0aCIsImFjY29yZGlvbnMiLCJhY2NvcmRpb24iLCJyb3dzIiwicm93IiwicXVlcnlTZWxlY3RvciIsImNvbnRlbnQiLCJ0b2dnbGUiLCJtYXhIZWlnaHQiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJhZGQiLCJzY3JvbGxIZWlnaHQiLCJtb2RhbFRvZ2dsZXMiLCJtb2RhbCIsImRhdGFzZXQiLCJtb2RhbFRvZ2dsZSIsImNsb3NlIiwib3V0c2lkZUNsaWNrTGlzdGVuZXIiLCJldmVudCIsImNvbnRhaW5zIiwidGFyZ2V0IiwiaGlkZSIsInJlbW92ZUNsaWNrTGlzdGVuZXIiLCJzaG93IiwicHJldmVudERlZmF1bHQiLCJzY3JvbGx1cCIsInNjcm9sbEhhbmRsZXIiLCJ3aW5kb3ciLCJwYWdlWU9mZnNldCIsInNjcm9sbHMiLCJzY3JvbGwiLCJvZmZzZXQiLCJ0b3AiLCJsZWZ0Iiwib2Zmc2V0VG9wIiwiYmVoYXZpb3IiLCJtZW51VG9nZ2xlIiwibWVudUxpc3QiLCJyZW1vdmVGb2N1c2FibGVMaXN0ZW5lciIsImtleUNvZGUiLCJmb3JtcyIsIm1lc3NhZ2VzQ29udGFpbmVyIiwibWVzc2FnZXMiLCJTZXQiLCJzaG93TWVzc2FnZSIsImVsIiwiY3JlYXRlRWxlbWVudCIsImlubmVySFRNTCIsInN0b3BQcm9wYWdhdGlvbiIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsImFwcGVuZENoaWxkIiwiYWN0aW9uIiwic3VjY2VzcyIsInJlc2V0Il0sInNvdXJjZVJvb3QiOiIifQ==