/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

let EXPORTED_SYMBOLS = ["Frequent"];

const { classes: Cc, interfaces: Ci, utils: Cu } = Components;
Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/PlacesUtils.jsm');

let Frequent = {
  query: function(aCallback, aLimit) {
    let options = PlacesUtils.history.getNewQueryOptions();
    options.maxResults = aLimit + 10;
    options.sortingMode = Ci.nsINavHistoryQueryOptions.SORT_BY_FRECENCY_DESCENDING

    let links = [];

    let callback = {
      handleResult: function (aResultSet) {
        let row;

        while (row = aResultSet.getNextRow()) {
          if (links.length >= aLimit) {
            break;
          }
          let url = row.getResultByIndex(1);
          let title = row.getResultByIndex(2);
          links.push({url: url, title: title});
        }
      },

      handleError: function (aError) {
        aCallback([]);
      },

      handleCompletion: function (aReason) {
        aCallback(links);
      }
    };

    let query = PlacesUtils.history.getNewQuery();
    let db = PlacesUtils.history.QueryInterface(Ci.nsPIPlacesDatabase);
    db.asyncExecuteLegacyQueries([query], 1, options, callback);
  }
};
