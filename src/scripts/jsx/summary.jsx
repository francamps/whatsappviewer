'use strict';

import Legend from './legend';
import WidgetTitle from './widget-title';

export default class Summary extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      messages: 'unknown',
      medias: 'unknown',
      date0: 'unknown',
      dateF: 'unknown',
      author0: 'unknown',
      authorF: 'unknown'
    }
  }

  componentDidMount () {
    let messageNum = this.props.conversation.getNumberOfMessages(),
        medias = this.props.conversation.getNumberOfMediaMessages();

    let messages = this.props.conversation.getMessages();

    let message0 = messages[0],
        messageF = messages[messages.length - 1];

    let date0 = message0.datetimeObj,
        author0 = message0.author,

        dateF = messageF.datetimeObj,
        authorF = messageF.author;

    let format = this.props.conversation.datetimeFormat;

    this.setState({
      messages: messageNum,
      medias: medias,
      date0: d3.timeFormat(format)(date0),
      dateF: d3.timeFormat(format)(dateF),
      author0: author0,
      authorF: authorF
    });
  }

  render () {
    return (
      <div className="summary">
        <WidgetTitle
          title={'Your conversation'} />
        <Legend
          conversation={this.props.conversation} />
        <div className="summary-metric-section">
          <p>
            <span className="summary-metric">{this.state.messages}</span>
            total messages processed
          </p>
          <p>
            <span className="summary-metric">{this.state.medias}</span>
            media messages (skipped)
          </p>
        </div>
        <div className="summary-metric-section">
          <div className="item">
            <p>First message:</p>
            <p className="summary-metric">{this.state.date0}</p>
            <p className="summary-metric">
              <span>by </span>
              {this.state.author0}
            </p>
          </div>
          <div className="item">
            <p>Last message:</p>
            <p className="summary-metric">{' ' + this.state.dateF}</p>
            <p className="summary-metric">
              <span>by </span>
              {this.state.authorF}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
