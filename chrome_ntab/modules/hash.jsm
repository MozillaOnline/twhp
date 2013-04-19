/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ['hashModule'];

var hash = {};

var hashModule = {
  add: function(key, value) {
    dump('Add key: ' + key + '\n');
    hash[key] = value;
  },

  remove: function(key) {
    dump('Remove key: ' + key + '\n');
    delete hash[key];
  },

  contains: function(key) {
    return typeof hash[key] != 'undefined';
  },

  getHashObject: function() {
    return hash;
  }
};
