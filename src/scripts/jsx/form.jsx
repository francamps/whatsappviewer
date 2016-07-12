'use strict';

import Instructions from './instructions';
import ChatForm from './chat-form';
import Notification from './notification';
import WidgetTitle from './widget-title';

export default class Form extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      classes: "form-container"
    }
  }

  showForm () {
    this.setState({
      classes: "form-container"
    });
  }

  hideForm () {
    this.setState({
      classes: "form-container hidden"
    });
  }

  componentWillUnmount () {
    if (this.props.isAnalyzed) {
      this.hideForm();
    }
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
      <div id="form-container" className={this.state.classes}>
        <div className="widget">
          <Instructions />
          <ChatForm onClickRender={this.props.onClickRender}/>
          {this.renderNotification()}
        </div>
      </div>
    );
  }
}
