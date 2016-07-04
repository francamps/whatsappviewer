'use strict';

import Instructions from './instructions';
import ChatForm from './chat-form';
import Notification from './notification';

export default class Form extends React.Component {
  render () {
    return (
      <div id="form-container" className="form-container">
        <div className="widget-title">
          <p>Explore and analyze your conversations</p>
        </div>
        <Instructions />
        <ChatForm />
        <Notification />
      </div>
    );
  }
}
