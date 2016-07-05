'use strict';

export default class Notification extends React.Component {
  render () {
    return (
      <div id="notification" className="widget notification">
        {this.props.message}
      </div>
    );
  }
}
