// MAIN script

// Will require conversation.js, viewer.js
'use strict';

var Viewer = require('./viewer.js');

/*document.querySelector("#add-conversation").addEventListener('click', function () {
  document.querySelector(".form-container").classList.toggle('hidden');
});*/

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
    var authorA = 'AuthorA';
    var authorB = 'AuthorB';
    var text = document.querySelector('#text').value || '';

    var whatsapp = {
      authorA: authorA || 'AuthorA',
      authorB: authorB || 'AuthorB',
      text: text
    }

    var isParsed = Viewer.init(whatsapp);
    if (isParsed) {
      Viewer.render();
      switchState();
    }
});
