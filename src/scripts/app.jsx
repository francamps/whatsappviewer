// MAIN script
'use strict';

import React from 'react';
import { render } from 'react-dom';

import Header from './jsx/header';
import Form from './jsx/form';
import Canvas from './jsx/canvas';
import Footer from './jsx/footer';

import Viewer from './viewer';

class App extends React.Component {
  componentDidMount () {
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
  }

  render () {
    return (
      <div>
        <Header />
        <div className="page-wrap">
          <Form />
          <Canvas />
        </div>
        <Footer />
      </div>
    );
  }
};

render((
  <App />
), document.getElementById("app"));
