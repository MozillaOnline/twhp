/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* Mozilla Online Addons */
if (!window['MOA']) {
  window['MOA'] = {};

  (function() {
    var rootNameSpace = this;

    // initialize namespace
    this.ns = function (str) {
      if (!str)
        return rootNameSpace;

      var tmpArray = str.split('.');

      var root = rootNameSpace;
      for (var i = 0; i < tmpArray.length; i++) {
        if (!root[tmpArray[i]])
          root[tmpArray[i]] = {};
        root = root[tmpArray[i]];
      }

      return root;
    };

    this.log = function(message) {
      Services.console.logStringMessage('>>>>' + message + '\n');
    };

    this.debug = function(message) {
      var isDebug = false;
      try {
        isDebug = Services.prefs.getBoolPref('mozillaonlineaddons.debug');
      } catch (err) {}
      if (isDebug) {
        this.log(message);
      }
    };
  }).apply(window['MOA']);
}
