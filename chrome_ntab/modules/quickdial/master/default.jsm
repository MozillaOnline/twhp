/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ['defaultQuickDial'];

defaultQuickDial = {
  dialData: {
    '1': {
      title: 'My Firefox',
      url: 'http://myfirefox.com.tw/?utm_source=myfirefox&utm_medium=browser&utm_campaign=adu'
    },

    '2': {
      title: 'Mozilla Taiwan \u5b98\u65b9\u7db2\u7ad9',
      url: 'http://mozilla.com.tw/'
    },

    '3': {
      title: 'Firefox Online \u706B\u72D0\u5546\u57CE',
      url: 'http://tw.mall.yahoo.com/store/firefox'
    },

    '4': {
      title: 'Firefox \u9644\u52A0\u5143\u4EF6',
      url: 'https://addons.mozilla.org/zh-TW/firefox/'
    },

    '5': {
      title: 'Gmail',
      url: 'https://mail.google.com/?hl=zh-TW'
    },

    '6': {
      title: 'Facebook',
      url: 'https://www.facebook.com/'
    },

    '7': {
      title: 'Mozilla Support \u6280\u8853\u652F\u63F4\u7DB2\u7AD9',
      url: 'https://support.mozilla.org/zh-TW/home'
    }
  },

  snapshotMap: {
    'http://mozilla.com.tw/': 'chrome://ntab/skin/thumb/master/firefox.jpg',
    'https://addons.mozilla.org/zh-TW/firefox/': 'chrome://ntab/skin/thumb/master/amo.jpg',
    'https://www.facebook.com/': 'chrome://ntab/skin/thumb/master/fb.jpg',
    'http://myfirefox.com.tw/?utm_source=myfirefox&utm_medium=browser&utm_campaign=adu': 'chrome://ntab/skin/thumb/master/myfirefox.jpg',
    'https://mail.google.com/?hl=zh-TW': 'chrome://ntab/skin/thumb/master/gmail.jpg',
    'http://tw.mall.yahoo.com/store/firefox': 'chrome://ntab/skin/thumb/master/mocotw-store.jpg',
    'https://support.mozilla.org/zh-TW/home': 'chrome://ntab/skin/thumb/master/sumo.jpg'
  }
};
