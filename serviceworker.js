/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const pkg = __webpack_require__(1);

const CACHE_BASENAME = 'score.fels.app';
const cacheName = `${CACHE_BASENAME}.${pkg.version}`;

const NOT_FOUND_ERROR = 404;

self.addEventListener('install', function (event) {
    console.log('Installing service worker.', {cacheName: cacheName});

    let indexPageRequest = new Request('index.html');
    event.waitUntil(
        fetch(indexPageRequest)
            .then(response => writeToCache(indexPageRequest, response))
            .catch(error => {
                console.error('Fetch during install failed', {url:indexPageRequest.url, error: error});
            })
    );
});

//If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                return writeToCache(event.request, response);
            })
            .catch(error => {
                let info = {
                    url: event.request.url,
                    error: error,
                    request: event.request
                };
                console.log('Serving content from cache.', info);

                return readFromCache(event.request);
            })
            .catch(function (error) {
                console.error('Unknown error.', {error: error, request: event.request})
            })
    );
});

/**
 * @param {Request} request
 * @returns {!Promise<Response>}
 */
function readFromCache(request) {
    return caches.open(cacheName)
        .then(cache => cache.match(request))
        .then(cachedResponse => {
            let response = null;

            if (cachedResponse && cachedResponse.status !== NOT_FOUND_ERROR) {
                response = cachedResponse;
            } else {
                console.error('Resource not found in cache.', {url: request.url, request: request});
            }

            return response
        });
}

/**
 * @param {Request} request
 * @param {Response} response
 * @returns {!Promise<!Response>}
 */
function writeToCache(request, response) {
    return caches.open(cacheName)
        .then(cache => {
            console.log('Add resource to cache', {url: response.url, response: response});

            // When using the response the body gets locked and no further usages are possible.
            return cache.put(request, response.clone());
        })
        .catch(error => {
            console.warn('Response could not be added to cache.', {error, response});
        })
        .then(() => {
            return response
        });
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = {"version":"0.1.0"};


/***/ })
/******/ ]);