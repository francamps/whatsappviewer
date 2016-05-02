// MAIN script

// Will require conversation.js, viewer.js
// var Viewer = require(viewer.js);
'use strict';

var Viewer = require('./viewer.js');

document.querySelector("#render-button").addEventListener('click', function () {
    // This will trigger a rerender
    Viewer.render();
})
