/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { interfaces: Ci, utils: Cu } = Components;

Cu.import('resource://gre/modules/XPCOMUtils.jsm');
Cu.import('resource://gre/modules/Services.jsm');

function AboutNTab() {}
AboutNTab.prototype = {
  classDescription: 'Taiwan Edition New Tab about:ntab',
  contractID: '@mozilla.org/network/protocol/about;1?what=ntab',
  classID: Components.ID('89c12df6-b28e-4c93-82b8-4251059c670e'),
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIAboutModule]),

  getURIFlags: function(aURI) {
    return (Ci.nsIAboutModule.URI_SAFE_FOR_UNTRUSTED_CONTENT |
            Ci.nsIAboutModule.ALLOW_SCRIPT);
  },

  newChannel: function(aURI) {
    var home = 'chrome://ntab/content/ntab.xhtml';
    var channel = Services.io.newChannel(home, null, null);
    channel.originalURI = aURI;
    return channel;
  }
};

const NSGetFactory = XPCOMUtils.generateNSGetFactory([AboutNTab]);
