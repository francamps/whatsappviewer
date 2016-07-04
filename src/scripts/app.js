// MAIN script
'use strict';
import Viewer from './viewer';

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
      let text = document.querySelector('#text').value || '';
      let CanvasViewer = new Viewer(text);

      if (CanvasViewer.isParsed) {
        CanvasViewer.render();
        switchState();
      }
  });

})();
