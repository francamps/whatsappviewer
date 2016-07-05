'use strict';

import Row from './row';

export default class DataTable extends React.Component {
  renderTitle () {
    return (
      <h3>Additional metrics</h3>
    );
  }

  render () {
    return (
      <div className="widget">
        {this.renderTitle()}
        <div className="data-table">
          <Row metricID={'author'}
              metricLabel={''} />
          <Row metricID={'word-count'}
              metricLabel={'Words per message (avg / median)'} />
          <Row metricID={'message-num'}
              metricLabel={'Number of messages'} />
          <Row metricID={'resp-times'}
              metricLabel={'Response times frequency'} />
          <Row metricID={'resp-times-chat'}
              metricLabel={'Response times frequency in chat mode (RT < 15min)'} />
        </div>
      </div>
    )
  }
}
