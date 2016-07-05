'use strict';

import Legend from './legend';
import Widget from './widget';
import DataTable from './data-table/table';

export default class Canvas extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      classes: "canvas hidden"
    }
  }


  componentWillReceiveProps (nextProps) {
    if (nextProps.isShowing) {
      this.setState({
        classes: "canvas showing"
      });
      document.body.scrollTop = 0;
    }
  }

  renderTitle () {
    return (
      <div id="dashboard-title" className="widget-title">
        <p>Your conversation</p>
      </div>
    );
  }

  render () {
    return (
      <div id="canvas" className={this.state.classes}>
        {this.renderTitle()}
        <Legend />
        <Widget
          title={'Volume of messages over time'}
          svgID={'graph-viewer'}
          renderSearchBox={true} />
        <Widget
          title={'Volume of messages per time of day'}
          svgID={'widget-2'} />
        <Widget
          title={'Response times per day (average)'}
          svgID={'widget-3'} />
        <DataTable />
      </div>
    );
  }
}
