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
  constructor(props) {
    super(props);
    this.state = {
      isAnalyzed: false,
    }
  }

  switchState () {
    this.setState({
      isAnalyzed: true
    });
  }

  toggleForm () {
    let text = document.querySelector('#text').value || '';
    let CanvasViewer = new Viewer(text);

    if (CanvasViewer.isParsed) {
      CanvasViewer.render();
      this.switchState();
    }
  }

  render () {
    return (
      <div>
        <Header />
        <div className="page-wrap">
          <Form
            isAnalyzed={this.state.isAnalyzed}
            onClickRender={this.toggleForm.bind(this)}/>
          <Canvas
            isShowing={this.state.isAnalyzed}/>
        </div>
        <Footer />
      </div>
    );
  }
};

render((
  <App />
), document.getElementById("app"));
