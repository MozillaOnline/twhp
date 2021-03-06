/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const { classes: Cc, interfaces: Ci, results: Cr, utils: Cu } = Components;

Cu.import("resource://ntab/PageThumbs.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");

XPCOMUtils.defineLazyModuleGetter(this, "Services",
  "resource://gre/modules/Services.jsm");

function Protocol() {
}

Protocol.prototype = {
  get scheme() PageThumbs.scheme,

  get defaultPort() -1,

  get protocolFlags() {
    return Ci.nsIProtocolHandler.URI_DANGEROUS_TO_LOAD |
           Ci.nsIProtocolHandler.URI_NORELATIVE |
           Ci.nsIProtocolHandler.URI_NOAUTH;
  },

  newURI: function Proto_newURI(aSpec, aOriginCharset) {
    let uri = Cc["@mozilla.org/network/simple-uri;1"].createInstance(Ci.nsIURI);
    uri.spec = aSpec;
    return uri;
  },

  newChannel: function Proto_newChannel(aURI) {
    let {url} = parseURI(aURI);
    let file = PageThumbsStorage.getFileForURL(url);
    if (file.exists()) {
      let fileuri = Services.io.newFileURI(file);
      return Services.io.newChannelFromURI(fileuri);
    }

    let chromeWindow = Services.wm.getMostRecentWindow('navigator:browser');
    chromeWindow.MOA.NTab.Snapshot.createSnapshot(url);
    return Services.io.newChannel("chrome://ntab/skin/icon/animated.png", null, null);
  },

  allowPort: function () false,

  classID: Components.ID("{fdc3c9cd-c6eb-40c5-bb31-98c9f97e9da3}"),
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIProtocolHandler])
};

let NSGetFactory = XPCOMUtils.generateNSGetFactory([Protocol]);

function parseURI(aURI) {
  let {scheme, staticHost} = PageThumbs;
  let re = new RegExp("^" + scheme + "://" + staticHost + ".*?\\?");
  let query = aURI.spec.replace(re, "");
  let params = {};

  query.split("&").forEach(function (aParam) {
    let [key, value] = aParam.split("=").map(decodeURIComponent);
    params[key.toLowerCase()] = value;
  });

  return params;
}
