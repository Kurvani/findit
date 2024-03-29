// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"redditapi.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  search: function search(searchTerm, searchLimit, sortBy) {
    //This is where we're goign to make our request. ?q= is to query
    return fetch( //fetch returns a promise
    "http://www.reddit.com/search.json?q=".concat(searchTerm, "&sort]").concat(sortBy, "&limit=").concat(searchLimit)).then(function (res) {
      return res.json();
    }) // with the fetch api we'll do a .then to get the dresponse and then say we want that response in .json //Then we do another .then to give us the data
    .then(function (data) {
      return data.data.children.map(function (data) {
        return data.data;
      });
    }).catch(function (err) {
      return console.log(err);
    }); //Put a catch error function at the end just in case. TODO: are lines 6-10 essentially just one giant line of code separated for the sake of readability? FIND OUT!
  }
};
exports.default = _default;
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _redditapi = _interopRequireDefault(require("./redditapi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var searchForm = document.getElementById("search-form");
var searchInput = document.getElementById("search-input"); //Grab the searchForm variable and add on an EventListener
//When you have an EventListener you can pass in an event parameter as well (which we use 'e')
// Form Event Listener

searchForm.addEventListener("submit", function (e) {
  // Get search term (we grab this from our searchInput variable and grab the value stored in it)
  var searchTerm = searchInput.value; // Get sort
  // We can use any kind of selector so we do any input with the name of "sortby" but we want the one that's checked so we use ':checked'

  var sortBy = document.querySelector('input[name="sortby"]:checked').value; //Get limit

  var searchLimit = document.getElementById("limit").value; // Check input to make sure we don't have an empty form

  if (searchTerm == "") {
    //Show message there is nothing typed in
    showMessage("Please add a search term", "alert-danger");
  } // Clear input when typing in search


  searchInput.value = ""; // Search Reddit (we imported our reddit search function that uses the Reddit API)

  _redditapi.default.search(searchTerm, searchLimit, sortBy).then(function (results) {
    var output = '<div class="card-columns">'; //We use let for our variable because we're goign to manipulate it
    // Loop through posts

    results.forEach(function (post) {
      // Check for image. We're essentailly saying if the post has a preview image use it, otherwise use the image at the URL. The ':' means else.
      var image = post.preview ? post.preview.images[0].source.url : "https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg";
      output += "\n        <div class=\"card\">\n  <img class=\"card-img-top\" src=\"".concat(image, "\" alt=\"Card image cap\">\n  <div class=\"card-body\">\n    <h5 class=\"card-title\">").concat(post.title, "</h5>\n    <p class=\"card-text\">").concat(truncateText(post.selftext, 100), "</p>\n    <a href=\"").concat(post.url, "\" target=\"_blank\" class=\"btn btn-primary\">Read More</a>\n    <hr>\n    <span class=\"badge badge-secondary\">Subreddit: ").concat(post.subreddit, "</span>\n    <span class=\"badge badge-dark\">Upvotes: ").concat(post.score, "</span>\n    </div>\n</div>\n        ");
    });
    output += "</div>"; //Append the ending div to our output

    document.getElementById("results").innerHTML = output;
  }); //preventDefault to prevent the form from actaully submitting to a file


  e.preventDefault();
}); // Show Message

function showMessage(message, className) {
  // Create the div
  var div = document.createElement("div"); // Add our classes to that div we just created

  div.className = "alert ".concat(className); //We're using backticks because we're going to use a variable; which is a template string which is part of ES6. Now with bootstrap your class should be alert and then whatever the color you want or the type
  // Add text
  // appendChild() means to put something inside of it. In this case put something inside our div

  div.appendChild(document.createTextNode(message)); //Now to get it into the DOM so it displays
  //Get parent

  var searchContainer = document.getElementById("search-container"); // Get search

  var search = document.getElementById("search"); // Insert message
  //so we take the container and we want to insert the 'div' before the 'search' element

  searchContainer.insertBefore(div, search); // Timeout to get rid of alert message after a while
  //We can use an arrow instead of a function TODO: need more details on Arrow Functions
  //Since we are grabing a class we use querySelector().
  //setTimeout takes two parameters, what we're doing and then the time to remove, which is in milliseconds

  setTimeout(function () {
    return document.querySelector(".alert").remove();
  }, 3000);
} // Truncate Text


function truncateText(text, limit) {
  var shortened = text.indexOf(" ", limit);
  if (shortened == -1) return text;
  return text.substring(0, shortened);
}
},{"./redditapi":"redditapi.js"}],"C:/Users/KuroshSV/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57265" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["C:/Users/KuroshSV/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/findit.e31bb0bc.map