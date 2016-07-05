// MAIN script
'use strict';

import React from 'react';
import { render } from 'react-dom';

import Header from './jsx/header';
import Form from './jsx/form';
import Canvas from './jsx/canvas';
import Footer from './jsx/footer';

import { getConfig } from './utilities/view-configuration';
import Conversation from './models/conversation';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAnalyzed: false,
      parsingError: false
    }
  }

  analyzeAndRender (text) {
    let viewConfig = getConfig();
    let Chat = new Conversation(text);

    if (Chat.isParsed) {
      this.setState({
        conversation: Chat,
        viewOpts: viewConfig,
        isAnalyzed: true
      });
    } else if (Chat.parsingError) {
      this.setState({
        parsingError: Chat.parsingError
      })
    }
  }

  render () {
    return (
      <div>
        <Header />
        <div className="page-wrap">
          <Form
            parsingError={this.state.parsingError}
            isAnalyzed={this.state.isAnalyzed}
            onClickRender={this.analyzeAndRender.bind(this)}/>
          <Canvas
            viewOpts={this.state.viewOpts}
            conversation={this.state.conversation}
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
