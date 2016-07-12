'use strict';

export default class Widget extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      longestSilence: 0
    }
    this.dispatcher = null;
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

    // REDO THIS, THIS IS UNACCEPTABLE
    // temporarily do this to check data-agnostic charts
    let thisView = new View(this.props.svgID + ' .svg', viewParams);
    let state = {
      data: [],
      domain: []
    }

    switch (this.props.svgID) {
      case 'widget-2':
        state = {
          data: this.props.conversation.getMessageTimes()
        }
        break;
      case 'widget-3':
        state = {
          data: this.props.conversation.getResponseTimesByAuthorDay(),
          domain: {
            time: [Convo.date0, Convo.dateF]
          }
        }
        break;
      case 'graph-viewer':
        state = {
          data: this.props.conversation.getWordsByAuthorAndDay(),
          domain: {
            time: [Convo.date0, Convo.dateF]
          },
          messages: this.props.conversation.getMessages()
        };
        break;
    }

    this.dispatcher = thisView.render(state);
    this.eventHandlers(this.dispatcher);
  }

  eventHandlers (dispatcher) {
    if (dispatcher) {
      dispatcher.on("bubble:mouseover", (d, i, author) => {
        this.props.handleShowTooltip('time-of-day', [d, i , author]);
      });
      dispatcher.on("bubble:mouseout", (d, i, author) => {
        this.props.handleHideTooltip();
      });
    }
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
