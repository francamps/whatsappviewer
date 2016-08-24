'use strict';

export default class Notification extends React.Component {
  render () {
    let classes = "notification " + this.props.type;
    return (
      <div id="notification" className={classes}>
        {this.props.message}
      </div>
    );
  }
}
