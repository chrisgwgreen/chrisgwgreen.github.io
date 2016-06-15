let Utils = {

  extend: function (defaults, options) {
    let extended = {};
    let prop;
    for (prop in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
        extended[prop] = defaults[prop];
      }
    }
    for (prop in options) {
      if (Object.prototype.hasOwnProperty.call(options, prop)) {
        extended[prop] = options[prop];
      }
    }
    return extended;
  },

  polyfil: function () {

    let lastTime = 0;
    let vendors = ['ms', 'moz', 'webkit', 'o'];

    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
        || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback) {
        let currTime = new Date().getTime();
        let timeToCall = Math.max(0, 16 - (currTime - lastTime));
        let id = window.setTimeout(function () {
            callback(currTime + timeToCall);
          },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }
  },

  polyfilMatchMedia: function () {

    /*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

    window.matchMedia || (window.matchMedia = function () {
      "use strict";

      // For browsers that support matchMedium api such as IE 9 and webkit
      let styleMedia = (window.styleMedia || window.media);

      // For those that don't support matchMedium
      if (!styleMedia) {
        let style = document.createElement('style'),
          script = document.getElementsByTagName('script')[0],
          info = null;

        style.type = 'text/css';
        style.id = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
          matchMedium: function (media) {
            let text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

            // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
            if (style.styleSheet) {
              style.styleSheet.cssText = text;
            } else {
              style.textContent = text;
            }

            // Test if media query is true or false
            return info.width === '1px';
          }
        };
      }

      return function (media) {
        return {
          matches: styleMedia.matchMedium(media || 'all'),
          media: media || 'all'
        };
      };
    }());


    /*! matchMedia() polyfill addListener/removeListener extension. Author & copyright (c) 2012: Scott Jehl. Dual MIT/BSD license */
    (function () {
      // Bail out for browsers that have addListener support
      if (window.matchMedia && window.matchMedia('all').addListener) {
        return false;
      }

      let localMatchMedia = window.matchMedia,
        hasMediaQueries = localMatchMedia('only all').matches,
        isListening = false,
        timeoutID = 0,    // setTimeout for debouncing 'handleChange'
        queries = [],   // Contains each 'mql' and associated 'listeners' if 'addListener' is used
        handleChange = function () {
          // Debounce
          clearTimeout(timeoutID);

          timeoutID = setTimeout(function () {
            for (let i = 0, il = queries.length; i < il; i++) {
              let mql = queries[i].mql,
                listeners = queries[i].listeners || [],
                matches = localMatchMedia(mql.media).matches;

              // Update mql.matches value and call listeners
              // Fire listeners only if transitioning to or from matched state
              if (matches !== mql.matches) {
                mql.matches = matches;

                for (let j = 0, jl = listeners.length; j < jl; j++) {
                  listeners[j].call(window, mql);
                }
              }
            }
          }, 30);
        };

      window.matchMedia = function (media) {
        let mql = localMatchMedia(media),
          listeners = [],
          index = 0;

        mql.addListener = function (listener) {
          // Changes would not occur to css media type so return now (Affects IE <= 8)
          if (!hasMediaQueries) {
            return;
          }

          // Set up 'resize' listener for browsers that support CSS3 media queries (Not for IE <= 8)
          // There should only ever be 1 resize listener running for performance
          if (!isListening) {
            isListening = true;
            window.addEventListener('resize', handleChange, true);
          }

          // Push object only if it has not been pushed already
          if (index === 0) {
            index = queries.push({
              mql: mql,
              listeners: listeners
            });
          }

          listeners.push(listener);
        };

        mql.removeListener = function (listener) {
          for (let i = 0, il = listeners.length; i < il; i++) {
            if (listeners[i] === listener) {
              listeners.splice(i, 1);
            }
          }
        };

        return mql;
      };
    }());

  }
};

export default Utils;
