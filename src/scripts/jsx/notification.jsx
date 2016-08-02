'use strict';

export default class Notification extends React.Component {
  render () {
    return (
      <div id="notification" className="notification">
        {this.props.message}
      </div>
    );
  }
}
