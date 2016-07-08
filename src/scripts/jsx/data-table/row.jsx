'use strict';

export default class RowTemp extends React.Component {
  constructor (props) {
    super(props);
  }

  renderViews () {
    let Convo = this.props.conversation;
    let data = this.props.data;
    let viewParams = this.props.viewParams;
    let View = this.props.view;
console.log(viewParams)
    let viewA = new View({
      Convo: Convo,
      options: viewParams
    }, this.props.metricID, data);
    viewA.render();
  }

  componentDidMount () {
    if (this.props.view) {
      this.renderViews();
    }
  }

  render () {
    return (
      <div className="row">
        <div className="cell metric-label">{this.props.metricLabel}</div>
        <div id={this.props.metricID} className="cell metric cell-chart">
          <div className="svg">
          </div>
        </div>
      </div>
    );
  }
}
