'use strict';

export default class Notification extends React.Component {

  errorMessages (type) {
    if (type === "tooManyAuthors") {
      return "Your chat seems to contain messages by more than 2 authors. \
            For now, please use one-on-one chats, with only 2 authors.";
    } else if (type === "unknownDateSystem"){
      return "I was unable to identify the date format. \
            Please select it manually from the drop down menu.";
    }
    return "There was an error parsing your chat. Sorry :/";
  }

  render () {
    let classes = "notification " + this.props.type;
    return (
      <div id="notification" className={classes}>
        {this.errorMessages(this.props.error)}
      </div>
    );
  }
}
