/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  function homepageFix(addon) {
    if (addon.id == "twhomepage@mozillaonline.com") {
      var abouturl = "http://myfirefox.com.tw/?utm_source=twhome&utm_medium=browser&utm_campaign=adu";
      try {
        abouturl = Services.prefs.getComplexValue("extensions.twhomepage.abouturl", Ci.nsIPrefLocalizedString).data;
      } catch(e) {}
      for (var j = 0; j < gBrowser.tabs.length; j++) {
        if (gBrowser.getBrowserAtIndex(j).contentWindow.document.location == "about:twhome") {
          gBrowser.getBrowserAtIndex(j).contentWindow.document.location = abouturl;
        }
      }
    }
  }

  var addonListener = {
    onUninstalling: function (addon) {
      homepageFix(addon);
    },

    onDisabling: function (addon) {
      homepageFix(addon);
    }
  };

  window.addEventListener('load', function() {
    window.setTimeout(function() {
      AddonManager.addAddonListener(addonListener);
      window.addEventListener('unload', function(evt) {
        AddonManager.removeAddonListener(addonListener);
      }, false);
    }, 10);
  }, false);
})();
