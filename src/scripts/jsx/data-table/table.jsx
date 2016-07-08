'use strict';

import Row from './row';
import DoubleRTHist from '../../views/double-RT-hist';
import ComparisonBar from '../../views/comparison-bar';

export default class DataTable extends React.Component {
  constructor (props) {
    super(props);
  }

  renderTitle () {
    return (
      <h3>Additional metrics</h3>
    );
  }

  extendParams () {
    let chatParams = _.cloneDeep(this.props.viewParams);
    chatParams["chatMode"] = true;
    return chatParams;
  }

  render () {
    return (
      <div className="widget">
        {this.renderTitle()}
        <div className="data-table">
          <Row metricID={'word-count'}
            conversation={this.props.conversation}
            data={this.props.conversation.getMessageWordCountAverage()}
            view={ComparisonBar}
            viewParams={this.props.viewParams}
            metricLabel={'Words per message (avg)'} />
          <Row metricID={'message-num'}
            conversation={this.props.conversation}
            data={this.props.conversation.getNumberOfMessagesByAuthor()}
            view={ComparisonBar}
            viewParams={this.props.viewParams}
            metricLabel={'Number of messages'} />
          <Row metricID={'resp-times'}
            conversation={this.props.conversation}
            view={DoubleRTHist}
            viewParams={this.props.viewParams}
            metricLabel={'Response time frequency'} />
          <Row metricID={'resp-times-chat'}
            conversation={this.props.conversation}
            view={DoubleRTHist}
            viewParams={this.extendParams()}
            metricLabel={'Response time frequency (chat mode, RT < 15min)'} />
        </div>
      </div>
    )
  }
}
