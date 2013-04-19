/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
  function addURLLink(event) {
    var contentDoc=event.target;
    var contentWin=contentDoc.defaultView;
    if(contentDoc.documentURI.match(/^about:neterror/) && contentWin == contentWin.top){
      var iframe = contentDoc.createElement('iframe');
      iframe.width = '625px';
      iframe.height = '0px';
      iframe.style.border = 'none';
      var errorPageContainer = contentDoc.getElementById('errorPageContainer');
      errorPageContainer.appendChild(iframe);
      iframe.src = Application.prefs.getValue("moa.ntab.view.errorpage.url","about:blank");
      iframe.addEventListener('load', function(){
        iframe.height = '400px';
      }, false);
      var timer = 0;
      var interval = setInterval(function(){
        if(timer < 150 && iframe.contentDocument) {
          if(iframe.contentDocument.readyState == 'complete' || iframe.contentDocument.readyState == 'interactive') {
            iframe.height = '400px';
            timer = 0;
            clearInterval(interval);
          } else {
            timer++;
          }
        } else {
          timer = 0;
          clearInterval(interval);
        }
      }, 200);
    }
  }

  window.addEventListener("load", function() {
    window.setTimeout(function() {
      document.getElementById('appcontent').addEventListener('DOMContentLoaded', addURLLink, false);
    }, 1000);
  }, false);
})();
