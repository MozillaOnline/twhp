/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { classes: Cc, interfaces: Ci, utils: Cu } = Components;

Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://ntab/utils.jsm');

var EXPORTED_SYMBOLS = ['quickDialModule'];

function completeURL(url) {
  if (!url)
    return url;

  if (url.indexOf('http://') != 0 && url.indexOf('https://') != 0 && url.indexOf('ftp://')!=0) {
    url = 'http://' + url;
  }

  try {
    return Services.io.newURI(url, null, null).spec;
  } catch (e) {
    return url;
  }
}

// Read quickdial data from json file under profile directory.
var dialData = null;
var defaultDialData = null;
var str = utils.readStrFromProFile(['ntab', 'quickdial.json']);
if (!!str) {
  dialData = JSON.parse(str);

  for (index in dialData) {
    var dial = dialData[index];
    dial.url = completeURL(dial.url);
  }
}



var defaultDataJSM = {};
try {
  var prefs = Services.prefs.getBranch('moa.ntab.dial.');
  var branch = prefs.getCharPref('branch');
  Cu.import('resource://ntab/quickdial/' + branch + '/default.jsm', defaultDataJSM);
} catch (e) {
  defaultDataJSM.defaultQuickDial = {
    dialData: {}
  };
}

// If json file is empty, then use default value;
if(!dialData) {
  dialData = defaultDataJSM.defaultQuickDial.dialData;
}
defaultDialData = defaultDataJSM.defaultQuickDial.dialData;

var defaultPosition = {};

for (var key1 in defaultDialData) {
  var val = defaultDialData[key1];
  defaultPosition[val.url] = val.rev ? [key1, 'r', val.rev].join('') : key1;
}


function _notifyAllNewTab(num) {
  // Modify pref to notify all the opened new tab.
  var prefs = Services.prefs.getBranch('moa.ntab.dial.');
  prefs.setCharPref('update.' + num, +new Date);
}

function _onDialModified(num) {
  _notifyAllNewTab(num);
  // Save all dial data into a json file
  utils.setStrToProFile(['ntab', 'quickdial.json'], JSON.stringify(dialData));
}

var quickDialModule = {
  getDial: function(num) {
    if (dialData[num]) {
      return {
        title: dialData[num].title,
        url: dialData[num].url,
        defaultposition : defaultPosition[dialData[num].url] || "",
        thumbnail: dialData[num].thumbnail || defaultDataJSM.defaultQuickDial.snapshotMap[dialData[num].url]
      }
    }

    return null;
  },
  refresh: function() {
    str = utils.readStrFromProFile(['ntab', 'quickdial.json']);
    if (!!str) {
      dialData = JSON.parse(str);
      for (index in dialData) {
        var dial = dialData[index];
        dial.url = completeURL(dial.url);
      }
    }
  },
  getDefaultDataStr: function() {
    return JSON.stringify(defaultDialData);
  },
  /**
   * Add to blank dial directly without index given. Called by clicking on menu item.
   *
   * @return
   *   -1: no blank dial
   *  >0: blank dial index
   *
   */
  fillBlankDial: function(data) {
    var prefs = Services.prefs.getBranch('moa.ntab.dial.');
    var _cell = prefs.getIntPref('column');
    var _row = prefs.getIntPref('row');
    _cell = Math.max(2, Math.min(_cell, 6));
    _row = Math.max(1, Math.min(_row, 20));

    var total = _cell * _row;
    var index = -1;
    for (var i = 1; i <= total; i++) {
      if (dialData[i])
        continue;

      index = i;
      break;
    }

    if (index > 0) {
      this.updateDial(index, data);
    }

    return index;
  },

  /**
   * Update dial title if title is empty or default value.
   */
  updateTitleIfEmpty: function(url, title) {
    var stringBundle = Cc['@mozilla.org/intl/stringbundle;1']
                         .getService(Ci.nsIStringBundleService)
                         .createBundle('chrome://ntab/locale/ntab.properties');

    for (var idx in dialData) {
      if (url == dialData[idx].url && !dialData[idx].title) {
        dialData[idx].title = title;
        _onDialModified(idx);
      }
    }
  },

  updateDial: function(num, data, delCache) {
    // Check if cache file should be deleted.
    if (true === delCache || (dialData[num] && dialData[num].url != data.url)) {
      var delCacheFile = true;
      var url = dialData[num].url;

      for (var idx in dialData) {
        if (dialData[idx].url == dialData[num].url && ('' + num) != ('' + idx)) {
          delCacheFile = false;
          break;
        }
      }

      if (delCacheFile) {
        utils.removeFile(['ntab', 'cache', utils.md5(dialData[num].url)]);
      }
    }

    // Update dial data
    if (!dialData[num]) {
      dialData[num] = {};
    }
    dialData[num].title = data.title;
    dialData[num].url = completeURL(data.url);

    _onDialModified(num);
  },

  snapshotDone: function(url) {
    this.refreshDialViewRelated(url);
  },

  refreshDialViewRelated: function(url) {
    for (var num in dialData) {
      if (dialData[num].url == url) {
        _notifyAllNewTab(num);
      }
    }
  },

  removeDial: function(num) {
    if (!dialData[num])
      return;

    // Check if cache file should be deleted.
    var url = dialData[num].url;
    var delCacheFile = true;

    for (var idx in dialData) {
      if (dialData[idx].url == url && ('' + num) != ('' + idx)) {
        delCacheFile = false;
        break;
      }
    }
    delete dialData[num];
    _onDialModified(num);

    if (delCacheFile) {
      utils.removeFile(['ntab', 'cache', utils.md5(url)]);
    }
  },

  exchangeDial: function(source, target) {
    if (source == target)
      return;

    var tmp = dialData[source];
    // if target is empty, then delete source data.
    if (!dialData[target]) {
      delete dialData[source];
    } else {
      dialData[source] = dialData[target];
    }

    if (!tmp) {
      delete dialData[target];
    } else {
      dialData[target] = tmp;
    }

    _onDialModified(source);
    _onDialModified(target);
  }
};
