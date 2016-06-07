// MAIN script

// Will require conversation.js, viewer.js
'use strict';

var Viewer = require('./viewer.js');

document.querySelector("#add-conversation").addEventListener('click', function () {
  document.querySelector(".form-container").classList.toggle('hidden');
});

document.querySelector("#render-button").addEventListener('click', function () {
    // This will trigger a rerender
    document.querySelector(".form-container").classList.add('hidden');

    var authorA = 'AuthorA';
    var authorB = 'AuthorB';
    var text = document.querySelector('#text').value || '';

    var whatsapp = {
      authorA: authorA || 'AuthorA',
      authorB: authorB || 'AuthorB',
      text: text
    }

    Viewer.init(whatsapp);
    Viewer.render();
});
