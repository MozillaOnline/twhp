/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ['FrameStorage'];

let FrameStorage = {
  _bundleFrame: function(aFilename) {
    return 'resource://ntab/frames/' + aFilename;
  },

  frames: function(aFilename) {
    // Just use local file. Don't fetch from internet any more. See bug 1840.
    return this._bundleFrame(aFilename);
  }
};
