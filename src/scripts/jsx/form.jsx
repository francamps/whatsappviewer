'use strict';

import Instructions from './instructions';
import ChatForm from './chat-form';
import Notification from './notification';

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

  componentWillReceiveProps (nextProps) {
    if (nextProps.isAnalyzed) {
      this.hideForm();
    }
  }

  renderTitle () {
    return (
      <div className="widget-title">
        <p>Explore and analyze your conversations</p>
      </div>
    );
  }

  render () {
    return (
      <div id="form-container" className={this.state.classes}>
        {this.renderTitle()}
        <Instructions />
        <ChatForm onClickRender={this.props.onClickRender}/>
        <Notification />
      </div>
    );
  }
}
