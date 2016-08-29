'use strict';

import Legend from './legend';
import SectionTitle from './section-title';

import Row from './data-table/row';
import ComparisonBar from '../views/comparison-bar';
import { getViewParams } from '../utilities/view-params';

export default class Summary extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      classes: "summary hidden",
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
        authorF = messageF.author,

        days = Math.floor((dateF - date0)/86400000);

    let format = this.props.conversation.datetimeFormat;
    let classes = (this.props.isShowing) ? "summary showing" : "summary hidden";

    this.setState({
      classes: classes,
      messages: messageNum,
      medias: medias,
      date0: d3.timeFormat(format)(date0),
      dateF: d3.timeFormat(format)(dateF),
      days: days,
      author0: author0,
      authorF: authorF
    });
  }

  renderFirstAndLast () {
    return (
      <div className="summary-metric-section">
        <div className="item">
          <p>First message:</p>
          <p className="summary-metric">
            <span>by:</span>
            {this.state.author0}
          </p>
          <p className="summary-metric">{this.state.date0}</p>
        </div>
        <div className="item">
          <p>Last message:</p>
          <p className="summary-metric">
            <span>by:</span>
            {this.state.authorF}
          </p>
          <p className="summary-metric">{' ' + this.state.dateF}</p>
        </div>
      </div>
    );
  }

  renderMessagesProcessed () {
    return (
      <div className="summary-metric-section">
        <p className="large">
          <span className="summary-metric">{this.state.messages}</span>
          total messages processed in <b>{this.state.days}</b> days
        </p>
        <p className="large">
          <span className="summary-metric large">{this.state.medias}</span>
          skipped media messages
        </p>
      </div>
    );
  }

  render () {
    return (
      <div className={this.state.classes}>
        <SectionTitle
          title={'Your conversation'} />
        <div className="summary-content">
          <Legend
            conversation={this.props.conversation} />
          {this.renderMessagesProcessed()}
          {this.renderFirstAndLast()}
        </div>
      </div>
    );
  }
}
