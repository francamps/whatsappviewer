// MAIN script
'use strict';

import React from 'react';
import { render } from 'react-dom';

import Header from './jsx/header';

import Landing from './jsx/landing';

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

  analyzeAndRender (text, dateFormat) {
    let viewParams = getViewParams();
    let Chat = new Conversation(text, dateFormat);

    if (Chat.isParsed && !Chat.parsingError) {
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

  renderLanding () {
    if (!this.state.isAnalyzed) {
      return (
        <Landing
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
            isShowing={this.state.isAnalyzed}
            conversation={this.state.conversation} />
      )
    }
  }

  renderChatForm () {
    this.setState({
      isAnalyzed: false,
      conversation: false,
      parsingError: false
    });
    document.body.scrollTop = 0;
  }

  renderHeader () {
    if (this.state.isAnalyzed) {
      return (
        <Header
          onClickNewChat={this.renderChatForm.bind(this)}/>
      );
    }
  }

  render () {
    return (
      <div className="app">
        {this.renderHeader()}
        <div className="page-wrap">
          {this.renderSummary()}
          {this.renderLanding()}
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
