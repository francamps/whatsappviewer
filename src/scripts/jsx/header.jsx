
'use strict';

export default class Header extends React.Component {

  renderNewChat () {
    if (this.props.isAnalyzed) {
      return (
        <span
          onClick={this.props.onClickNewChat}
          className="new-chat">New chat</span>
      );
    }
  }
  render () {
      return (
        <header>
    			<a href="./index.html">WhatsApp Explorer</a>
          {this.renderNewChat()}
    		</header>
      );
  }
}
