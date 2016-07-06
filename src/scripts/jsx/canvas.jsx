'use strict';

import Legend from './legend';
import Widget from './widget';
import WidgetTitle from './widget-title';
import DataTable from './data-table/table';

// views
import TimeOfDay from '../views/time-of-day';
import ResponseTimesTime from '../views/response-times-day';
import VolumeTime from '../views/volume-time';

export default class Canvas extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      classes: "canvas hidden"
    }
  }

  componentDidMount () {
    if (this.props.isShowing) {
      this.setState({
        classes: "canvas showing"
      });
      document.body.scrollTop = 0;
    }
  }

  render () {
    if (!this.props.isShowing) {
      return (
        <div id="canvas" className={this.state.classes}></div>
      );
    } else {
      return (
        <div id="canvas" className={this.state.classes}>
          <WidgetTitle
            title={'Your conversation'} />
          <Legend
            conversation={this.props.conversation}/>
          <Widget
            title={'Volume of messages over time'}
            view={VolumeTime}
            viewParams={this.props.viewParams}
            conversation={this.props.conversation}
            svgID={'graph-viewer'}
            renderSearchBox={true} />
          <Widget
            title={'Volume of messages per time of day'}
            view={TimeOfDay}
            viewParams={this.props.viewParams}
            conversation={this.props.conversation}
            svgID={'widget-2'} />
          <Widget
            title={'Response times per day (average)'}
            view={ResponseTimesTime}
            viewParams={this.props.viewParams}
            conversation={this.props.conversation}
            svgID={'widget-3'} />
          <DataTable
            viewParams={this.props.viewParams}
            conversation={this.props.conversation} />
        </div>
      );
    }
  }
}
