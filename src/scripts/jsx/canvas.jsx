'use strict';

import Widget from './widget';
import SectionTitle from './section-title';
import DataTable from './data-table/table';
import Tooltip from './tooltip';

// views
import TimeOfDay from '../views/time-of-day';
import ResponseTimesTime from '../views/response-times-day';
import VolumeTime from '../views/volume-time';

export default class Canvas extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      classes: "canvas hidden",
      tooltipShowing: false,
      typeOfInfo: undefined,
      infoToShow: '-'
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

  handleShowTooltip (typeOfInfo, info) {
    this.setState({
      tooltipShowing: true,
      typeOfInfo: typeOfInfo,
      infoToShow: info
    });
  }

  handleHideTooltip () {
    this.setState({
      tooltipShowing: false,
      infoToShow: '-'
    });
  }

  render () {
    if (!this.props.isShowing) {
      return (
        <div id="canvas" className={this.state.classes}></div>
      );
    } else {
      return (
        <div id="canvas" className={this.state.classes}>
          <SectionTitle
            title={"Insights"} />
          <Widget
            title={'Volume of words over time'}
            view={VolumeTime}
            viewParams={this.props.viewParams}
            conversation={this.props.conversation}
            svgID={'word-volume-widget'}
            renderSearchBox={true} />
          <Widget
            title={'Volume of messages per time of day'}
            view={TimeOfDay}
            viewParams={this.props.viewParams}
            conversation={this.props.conversation}
            handleShowTooltip={this.handleShowTooltip.bind(this)}
            handleHideTooltip={this.handleHideTooltip.bind(this)}
            svgID={'time-of-day-widget'} />
          <Widget
            title={'Response times per day (average)'}
            view={ResponseTimesTime}
            viewParams={this.props.viewParams}
            conversation={this.props.conversation}
            svgID={'response-time-day-widget'} />
          <DataTable
            handleShowTooltip={this.handleShowTooltip.bind(this)}
            handleHideTooltip={this.handleHideTooltip.bind(this)}
            viewParams={this.props.viewParams}
            conversation={this.props.conversation} />
          <Tooltip
            conversation={this.props.conversation}
            isShowing={this.state.tooltipShowing}
            typeOfInfo={this.state.typeOfInfo}
            infoToShow={this.state.infoToShow} />
          <div className="wide-button">
            <button>Try another chat</button>
          </div>
        </div>
      );
    }
  }
}
