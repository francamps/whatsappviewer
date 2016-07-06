// MAIN script
'use strict';

import React from 'react';
import { render } from 'react-dom';

import Header from './jsx/header';
import Form from './jsx/form';
import Canvas from './jsx/canvas';
import Footer from './jsx/footer';

import { getViewParams } from './utilities/view-params';
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
    let viewParams = getViewParams();
    let Chat = new Conversation(text);

    if (Chat.isParsed) {
      this.setState({
        conversation: Chat,
        viewParams: viewParams,
        isAnalyzed: true
      });
    } else if (Chat.parsingError) {
      this.setState({
        parsingError: Chat.parsingError
      })
    }
  }

  renderForm () {
    if (!this.state.isAnalyzed) {
      return (
        <Form
          parsingError={this.state.parsingError}
          isAnalyzed={this.state.isAnalyzed}
          onClickRender={this.analyzeAndRender.bind(this)}/>
      );
    }
  }

  renderCanvas () {
    if (this.state.isAnalyzed) {
      return (
        <Canvas
          viewParams={this.state.viewParams}
          conversation={this.state.conversation}
          isShowing={this.state.isAnalyzed}/>
      );
    }
  }

  render () {
    return (
      <div>
        <Header />
        <div className="page-wrap">
          {this.renderForm()}
          {this.renderCanvas()}
        </div>
        <Footer />
      </div>
    );
  }
};

render((
  <App />
), document.getElementById("app"));