/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  var sendlink = MOA.ns('NTab.SendLink');

  XPCOMUtils.defineLazyGetter(sendlink, 'appendText', function() {
    var strings = document.getElementById('ntab-strings');
    return '\n\n' + strings.getString('ntab.contextmenu.sendlink.message');
  });

  sendlink.onMenuItemCommand = function(event) {
    var aWindow = window.content;
    MailIntegration.sendMessage(aWindow.location.href + sendlink.appendText,
                                aWindow.document.title);
  };

  sendlink.onContextItemCommand = function(event) {
    MailIntegration.sendMessage(gContextMenu.linkURL + sendlink.appendText,
                                gContextMenu.linkText());
  };
})();
