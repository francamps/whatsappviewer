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
      <h3>Response time (RT)</h3>
    );
  }

  renderDetails () {
    return (
      <div>
        <p>
          Each bar corresponds to the number of messages that responded to
           others within the time shown. Say a message in the bar '1-2h'
           is a message that was responding to another message sent
           between 1 and 2 hours before that one.
        </p>
        <p>
          NOTE: only messages that follow a message from another author
          are counted as messages with a countable response time. If an author
          sends a message following one of her own, that message is not counted
          (and this happens very often).
        </p>
      </div>
    );
  }

  extendParamsForChatMode () {
    let chatParams = _.assignIn({"chatMode": true}, this.props.viewParams);
    return chatParams;
  }

  render () {
    return (
      <div className="widget">
        {this.renderTitle()}
        {this.renderDetails()}
        <div className="data-table">
          <Row metricID={'resp-times-chat'}
            data={this.props.conversation.getResponseTimesChatModeBuckets()}
            view={DoubleRTHist}
            viewParams={this.extendParamsForChatMode()}
            handleShowTooltip={this.props.handleShowTooltip}
            handleHideTooltip={this.props.handleHideTooltip}
            metricLabel={'Chat mode, (RT < 15min)'} />
          <Row metricID={'resp-times'}
            data={this.props.conversation.getResponseTimesBuckets()}
            view={DoubleRTHist}
            viewParams={this.props.viewParams}
            handleShowTooltip={this.props.handleShowTooltip}
            handleHideTooltip={this.props.handleHideTooltip}
            metricLabel={'Non-chat mode (RT > 15min)'} />
        </div>
      </div>
    )
  }
}
