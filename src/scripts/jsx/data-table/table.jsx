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
      <h3>Response time frequency</h3>
    );
  }

  extendParamsForChatMode () {
    let chatParams = Object.assign({"chatmode": true}, this.props.viewParams);
    return chatParams;
  }

  render () {
    return (
      <div className="widget">
        {this.renderTitle()}
        <div className="data-table">
          <Row metricID={'resp-times'}
            data={this.props.conversation.getResponseTimesBuckets()}
            view={DoubleRTHist}
            viewParams={this.props.viewParams}
            handleShowTooltip={this.props.handleShowTooltip}
            handleHideTooltip={this.props.handleHideTooltip}
            metricLabel={'Response time frequency'} />
          <Row metricID={'resp-times-chat'}
            data={this.props.conversation.getResponseTimesChatModeBuckets()}
            view={DoubleRTHist}
            viewParams={this.extendParamsForChatMode()}
            handleShowTooltip={this.props.handleShowTooltip}
            handleHideTooltip={this.props.handleHideTooltip}
            metricLabel={'Response time frequency (chat mode, RT < 15min)'} />
        </div>
      </div>
    )
  }
}
