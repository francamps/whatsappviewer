
'use strict';

export default class Header extends React.Component {
  render () {
      return (
        <header>
    			<a href="./index.html">WhatsApp Explorer</a>
          <span
            onClick={this.props.onClickNewChat}
            className="new-chat">New chat</span>
    		</header>
      );
  }
}
