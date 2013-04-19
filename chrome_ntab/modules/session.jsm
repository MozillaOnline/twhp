/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ["session"];

const { classes: Cc, interfaces: Ci, utils: Cu } = Components;

Cu.import('resource://ntab/Observers.js');
Cu.import('resource://ntab/utils.jsm');

var session = {
  isPrivateBrowsing: function() {
    var pbs = Cc["@mozilla.org/privatebrowsing;1"].
        getService(Ci.nsIPrivateBrowsingService);
    var inPrivateBrowsingMode = pbs.privateBrowsingEnabled;

    return inPrivateBrowsingMode && inPrivateBrowsingMode;
  },

  query: function(n) {
    if (this.isPrivateBrowsing())
      return [];

    var json = null;
    try {
      json = JSON.parse(utils.readStrFromProFile(['ntab', 'session.json']));
    } catch (e) {
      // dump(e);
    }

    var result = [];
    if (!json || !json.windows)
      return result;

    var hash = { };
    for (var i = 0; i < json.windows.length; i++) {
      var wnd = json.windows[i];
      for (var j = 0; j < wnd.tabs.length && result.length <= n; j++) {
        var tab = wnd.tabs[j];
        if (!tab.entries || isNaN(tab.index))
          continue;

        var index = parseInt(tab.index) - 1;
        if (!tab.entries[index])
          continue;

        var url = tab.entries[index].url;
        if (!url || hash.url || !/(http)|(ftp)|(https):\/\/.+/.test(url))
          continue;

        result.push(tab.entries[index]);
      }
    }
    return result;
  },

  save: function() {
    if (this.isPrivateBrowsing())
      return;

    var sessionStore = Cc['@mozilla.org/browser/sessionstore;1'].getService(Ci.nsISessionStore);
    utils.setStrToProFile(['ntab', 'session.json'], sessionStore.getBrowserState());
  }
};

var observer = {
  onQuitApplication: function() {
    Observers.remove("quit-application-granted", observer.onQuitApplication, observer);
    session.save();
  },

  onPrivateBrowsing: function(subject, topic, data) {
    privateBrowsing = topic == 'enter';
    Observers.remove("private-browsing", observer.onPrivateBrowsing, observer);
  }
};

// Can not observe 'quit-application' event
// because private browsing will be exit before 'quit-application' event is fired.
Observers.add("quit-application-granted", observer.onQuitApplication, observer);
