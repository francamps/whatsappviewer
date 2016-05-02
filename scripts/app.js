// MAIN script

// Will require conversation.js, viewer.js
// var Viewer = require(viewer.js);
'use strict';

var Viewer = require('./viewer.js');

document.querySelector("#render-button").addEventListener('click', function () {
    // This will trigger a rerender

    var authorA = document.querySelector('#authorA').value || 'francamps';
    var authorB = document.querySelector('#authorA').value || 'Paloma Arg';
    var text = document.querySelector('#text').value || '';

    var whatsapp = {
      authorA: authorA,
      authorB: authorB,
      text: text
    }

    Viewer.init(whatsapp);
    Viewer.render();
})
