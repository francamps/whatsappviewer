// MAIN script
'use strict';

import React from 'react';
import { render } from 'react-dom';

import Header from './jsx/header';
import Form from './jsx/form';

import Summary from './jsx/summary';
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
          onClickNewChat={this.renderChatForm.bind(this)}
          viewParams={this.state.viewParams}
          conversation={this.state.conversation}
          isShowing={this.state.isAnalyzed}/>
      );
    }
  }

  renderSummary () {
    if (this.state.isAnalyzed) {
      return (
          <Summary
            conversation={this.state.conversation} />
      )
    }
  }

  renderChatForm () {
    this.setState({
      isAnalyzed: false
    });
    document.body.scrollTop = 0;
  }

  render () {
    return (
      <div className="app">
        <Header
          isAnalyzed={this.state.isAnalyzed}
          onClickNewChat={this.renderChatForm.bind(this)}/>
        <div className="page-wrap">
          {this.renderSummary()}
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
