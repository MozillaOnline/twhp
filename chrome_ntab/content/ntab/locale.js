/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

let _ = (function() {
  var stringBundle = Cc['@mozilla.org/intl/stringbundle;1']
                       .getService(Ci.nsIStringBundleService)
                       .createBundle('chrome://ntab/locale/ntab.properties');

  var _ = function (strName, values) {
    if (!values)
      return stringBundle.GetStringFromName(strName);
    else
      return stringBundle.formatStringFromName(strName, values, values.length);
  }

  return _;
})();
