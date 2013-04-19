/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { interfaces: Ci, utils: Cu } = Components;

Cu.import('resource://gre/modules/XPCOMUtils.jsm');
Cu.import('resource://ntab/FrameStorage.jsm');

function TWhpFrameUpdater() {}
TWhpFrameUpdater.prototype = {
  classDescription: 'TWHP NTab Frame Updater',
  classID: '@mozillaonline.com/twhp-frame-updater;1',
  contractID: Components.ID('{375a716d-8d89-47c8-a242-03d0d74979fa}'),
  QueryInterface: XPCOMUtils.generateQI([Ci.nsISupports,
                                         Ci.nsITimerCallback]),

  // nsITimerCallback
  notify: function TWhpFrameUpdater_notify(aTimer) {
    FrameStorage.update();
  }
};

var NSGetFactory = XPCOMUtils.generateNSGetFactory([TWhpFrameUpdater])
