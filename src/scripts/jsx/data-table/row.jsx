'use strict';

export default class Row extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="row">
        <div id={this.props.metricID + "-A"} className="cell metric"></div>
        <div className="cell metric-label">{this.props.metricLabel}</div>
        <div id={this.props.metricID + "-B"} className="cell metric"></div>
      </div>
    );
  }
}
