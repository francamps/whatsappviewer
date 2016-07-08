'use strict';

export default class Widget extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      longestSilence: 0
    }
  }

  renderTitle () {
    return (
      <h3>{this.props.title}</h3>
    );
  }

  formatSilenceDuration (duration) {
    duration = duration / 1000;
    let days = 0,
        hours = 0,
        minutes = 0;

    if (duration > 86400) {
      days = Math.floor(duration / 86400);
    }

    if (duration > 3600) {
      let hoursDecimal = ((duration / 86400) - days) * 86400 / 3600;
      hours = Math.floor(hoursDecimal);

      minutes = Math.round((hoursDecimal - hours) * 60);
    }

    return `${days} days, ${hours} hours, ${minutes} minutes`;
  }

  renderSVG () {
    if (this.props.svgID) {
      return (
        <div className="svg"></div>
      );
    }
  }

  renderSearchBox () {
    if (this.props.renderSearchBox) {
      return (
        <form id="search-form" className="form">
          <input id="search-box" type="text" placeholder="Search a word or phrase"></input>
        </form>
      );
    }
  }

  renderMetric () {
    if (this.props.svgID === 'widget-3') {
      return (
        <div className="widget-extra-metric">
          <p>
            Longest silence period:
            <span className="summary-metric">{this.state.longestSilence}</span>
          </p>
          <p>
            Total number of silent days (MADE UP!):
            <span className="summary-metric">87</span>
          </p>
        </div>
      );
    }
  }

  // Volume of messages per time of day
  componentDidMount () {
    if (this.props.view) {
      this.renderSVGs();
    }
    if (this.props.svgID === 'widget-3') {
      let silence = this.props.conversation.getLongestSilence();

      this.setState({
        longestSilence: this.formatSilenceDuration(silence.duration)
      });
    }
  }

  renderSVGs () {
    let Convo = this.props.conversation;
    let viewParams = this.props.viewParams;
    let View = this.props.view;

    let thisView = new View({
      Convo: Convo,
      options: viewParams
    });
    thisView.render();
  }

  render () {
    return (
      <div id={this.props.svgID} className="widget">
        {this.renderTitle()}
        {this.renderSVG()}
        {this.renderSearchBox()}
        {this.renderMetric()}
      </div>
    );
  }
}
