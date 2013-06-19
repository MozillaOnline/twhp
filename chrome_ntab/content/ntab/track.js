/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var tracker = (function() {
  var _trackurl = 'http://adu.myfirefox.com.tw/addons/ntab.gif';

  function _trace_link(link) {
    if (!link.href || (link.href.indexOf('http://') != 0 && link.href.indexOf('https://') != 0))
      return;

    if (!_identify(link))
      return;

    tracker.track({
      type: 'link',
      action: 'click',
      href: link.href,
      title: link.title
    });
  }

  function _identify(link) {
    while (link && link.classList) {
      if (link.classList.contains('no-link-trace')) {
        return false;
      }

      if (link.classList.contains('link-trace')) {
        return true;
      }

      link = link.parentNode;
    }

    return false;
  }

  function extend(src, target) {
    for (var key in src) {
      target[key] = src[key];
    }
    return target;
  }

  return {
    track: function(option) {
      // getDataChoices
      if(! Application.prefs.getValue("extensions.tpmanager.tracking.enabled",false))
        return;
      option = extend(option, {
        type: '',
        action: '',
        fid: '',
        sid: '',
        href: '',
        title: ''
      });

      if (!option.type && !option.sid && !option.action)
        return;

      var image = new Image();
      var args = [];
      args.push('c=ntab');
      args.push('t=' + encodeURIComponent(option.type));
      args.push('a=' + encodeURIComponent(option.action));
      args.push('d=' + encodeURIComponent(option.sid));
      args.push('f=' + encodeURIComponent(option.fid));
      if (option.title) {
        args.push('ti=' + encodeURIComponent(option.title));
      }
      if (option.href) {
        args.push('hr=' + encodeURIComponent(option.href));
      }
      args.push('r=' + Math.random());
      args.push('cid=' + Application.prefs.getValue("app.taiwanedition.channel","www.myfirefox.com.tw"));
      image.src = _trackurl + '?' + args.join('&');
    },

    onclick: function(event) {
      var target = event.target;
      if (!(target instanceof HTMLAnchorElement) && target.parentNode && target.parentNode instanceof HTMLAnchorElement) {
        target = target.parentNode;
      }

      if (!(target instanceof HTMLAnchorElement))
        return;

      _trace_link(target);
    }
  }
})();

document.addEventListener('click', tracker.onclick, false);