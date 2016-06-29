// MAIN script
'use strict';

var Viewer = require('./viewer.js');

(function () {

  function switchState() {
    // This will trigger a rerender
    document.querySelector(".form-container").classList.add('hidden');

    window.setTimeout(function () {
      document.querySelector(".form-container").classList.add('removed');
      document.querySelector(".canvas").classList.remove('hidden');
      document.body.scrollTop = 0;
    }, 1000);
  }

  document.querySelector("#render-button").addEventListener('click', function () {
      var text = document.querySelector('#text').value || '';

      var isParsed = Viewer.init(text);
      if (isParsed) {
        Viewer.render();
        switchState();
      }
  });

})();
