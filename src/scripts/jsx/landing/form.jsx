'use strict';

import Instructions from './instructions';
import ChatForm from './chat-form';
import Notification from '../notification';

export default class Form extends React.Component {
  constructor (props) {
    super(props);
  }

  renderNotification () {
    if (this.props.parsingError) {
      return (
        <Notification
          message={this.props.parsingError} />
      );
    }
  }

  render () {
    return (
      <div id="form-container" className="form-container">
        <div className="widget">
          <p>Email yourself your conversation from your app and paste the text of it here. (<span>How do I do this?</span>)</p>
          <ChatForm onClickRender={this.props.onClickRender}/>
          {this.renderNotification()}
        </div>
      </div>
    );
  }
}
