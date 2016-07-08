'use strict';

export default class Summary extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      messages: 'unknown',
      medias: 'unknown'
    }
  }

  componentDidMount () {
    let messages = this.props.conversation.getNumberOfMessages(),
        medias = this.props.conversation.getNumberOfMediaMessages();

    this.setState({
      messages: messages,
      medias: medias
    });
  }

  render () {
    return (
      <div className="widget summary">
        <span>
          <span className="summary-metric">{this.state.messages}</span>
          total messages processed
        </span>
        <span>
          <span className="summary-metric">{this.state.medias}</span>
          media messages (skipped)
        </span>
      </div>
    );
  }
}
