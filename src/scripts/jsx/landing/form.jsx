'use strict';

import Instructions from './instructions';
import ChatForm from './chat-form';

export default class Form extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isShowingInstructions: false
    }
  }

  showInstructions () {
    this.setState({
      isShowingInstructions: !this.state.isShowingInstructions
    });
  }

  render () {
    return (
      <div id="form-container" className="form-container">
        <div className="widget">
          <p>
            Email yourself your conversation from your app and paste the text here.
            (<span className="show-instructions" onClick={this.showInstructions.bind(this)}>How do I do this?</span>)
          </p>
          <Instructions isShowing={this.state.isShowingInstructions}/>
          <ChatForm
            parsingError={this.props.parsingError}
            onClickRender={this.props.onClickRender}/>
        </div>
      </div>
    );
  }
}
