/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { interfaces: Ci, utils: Cu } = Components;

Cu.import('resource://gre/modules/XPCOMUtils.jsm');
Cu.import('resource://gre/modules/Services.jsm');

function AboutTWhome() {}
AboutTWhome.prototype = {
  classDescription: 'Taiwan Edition New Home about:twhome',
  contractID: '@mozilla.org/network/protocol/about;1?what=twhome',
  classID: Components.ID('5ae6894d-7f12-414a-b9a4-6b467d5b5a10'),
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIAboutModule]),

  getURIFlags: function(aURI) {
    return Ci.nsIAboutModule.ALLOW_SCRIPT;
  },

  newChannel: function(aURI) {
    var home = 'chrome://twhomepage/content/aboutHome.xul';
    var channel = Services.io.newChannel(home, null, null);
    channel.originalURI = aURI;
    return channel;
  }
};

const NSGetFactory = XPCOMUtils.generateNSGetFactory([AboutTWhome]);
