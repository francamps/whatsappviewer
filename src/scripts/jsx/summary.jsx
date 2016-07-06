'use strict';

export default class Summary extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      messages: 'unknown',
      medias: 'unknown',
      longestSilence: 'unknown'
    }
  }

  formatSilenceDuration (duration) {
    duration = duration / 1000;
    let days = 0,
        hours = 0,
        minutes = 0;

    if (duration > 86400) {
      days = Math.floor(duration / 86400);
    }

    if (duration > 3600) {
      let hoursDecimal = ((duration / 86400) - days) * 86400 / 3600;
      hours = Math.floor(hoursDecimal);

      minutes = Math.round((hoursDecimal - hours) * 60);
    }

    return `${days} days, ${hours} hours, ${minutes} minutes`;
  }

  componentDidMount () {
    let messages = this.props.conversation.getNumberOfMessages(),
        medias = this.props.conversation.getNumberOfMediaMessages(),
        silence = this.props.conversation.getLongestSilence();

    this.setState({
      messages: messages,
      medias: medias,
      longestSilence: this.formatSilenceDuration(silence.duration)
    });
  }

  render () {
    return (
      <div className="summary">
        <p>Total messages: {this.state.messages}</p>
        <p>Longest silence period: {this.state.longestSilence}</p>
        <p>Media-based messages (ignored): {this.state.medias}</p>
      </div>
    );
  }
}
