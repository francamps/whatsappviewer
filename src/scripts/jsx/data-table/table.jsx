'use strict';

import Row from './row';
import ResponseTimesHist from '../../views/response-times-hist';

export default class DataTable extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      wordCountA: 0,
      wordCountB: 0,
      messageNumA: 0,
      messageNumB: 0,
      authorA: 'authorA',
      authorB: 'authorB'
    }
  }

  renderTitle () {
    return (
      <h3>Additional metrics</h3>
    );
  }

  componentDidMount () {
    this.fillData();
  }

  fillData () {
		let countsAvg = this.props.conversation.getMessageWordCountAverage(),
				countsMed = this.props.conversation.getMessageWordCountMedian(),
        messageNum = this.props.conversation.getNumberOfMessagesByAuthor();

    this.setState({
      wordCountA: countsAvg.authorA.toFixed(2) + " / " + countsMed.authorA.toFixed(2),
      wordCountB: countsAvg.authorB.toFixed(2) + " / " + countsMed.authorB.toFixed(2),
      messageNumA: messageNum.authorA,
      messageNumB: messageNum.authorB,
      authorA: this.props.conversation.authorAName,
      authorB: this.props.conversation.authorBName
    });
  }

  render () {
    return (
      <div className="widget">
        {this.renderTitle()}
        <div className="data-table">
          <Row metricID={'author'}
            cellA={this.state.authorA}
            cellB={this.state.authorB}
            metricLabel={''} />
          <Row metricID={'word-count'}
            cellA={this.state.wordCountA}
            cellB={this.state.wordCountB}
            metricLabel={'Words per message (avg / median)'} />
          <Row metricID={'message-num'}
            cellA={this.state.messageNumA}
            cellB={this.state.messageNumB}
            metricLabel={'Number of messages'} />
          <Row metricID={'resp-times'}
            conversation={this.props.conversation}
            view={ResponseTimesHist}
            viewOpts={this.props.viewOpts}
            chatMode={false}
            metricLabel={'Response times frequency'} />
          <Row metricID={'resp-times-chat'}
            conversation={this.props.conversation}
            view={ResponseTimesHist}
            viewOpts={this.props.viewOpts}
            chatMode={true}
            metricLabel={'Response times frequency in chat mode (RT < 15min)'} />
        </div>
      </div>
    )
  }
}
