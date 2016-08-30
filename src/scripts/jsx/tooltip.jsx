'use strict';

export default class Tooltip extends React.Component {
  constructor (props) {
    super(props);
  }

  getClasses () {
    let classes = 'tooltip';
    if (this.props.isShowing) {
      classes += ' showing';
    } else {
      classes += ' hidden';
    }
    return classes
  }

  renderInfo () {
    if (this.props.typeOfInfo === 'time-of-day') {
      return this.renderTimeOfDayInfo();
    } else if (this.props.typeOfInfo === 'double-RT-hist') {
      return this.renderDoubleRTHist();
    } else if (this.props.typeOfInfo === 'volume-time') {
      return this.renderWordsTime();
    } else if (this.props.typeOfInfo === 'day-of-week') {
      return this.renderWeekdayInfo();
    }
  }

  renderTimeOfDayInfo () {
    let messages = this.props.infoToShow[0],
        bubble = this.props.infoToShow[1],
        whichAuthor = this.props.infoToShow[2],
        conv = this.props.conversation,
        author = (whichAuthor === 'A') ? conv.authorAName : conv.authorBName;

    return (
      <div>
        <span className="variable">{author} </span>
        sent <span className="variable">{messages} </span>
        messages at {bubble}h.
      </div>
    );
  }

  renderWeekdayInfo () {
    let messages = this.props.infoToShow[0],
        dayIndex = this.props.infoToShow[1],
        whichAuthor = this.props.infoToShow[2],
        conv = this.props.conversation,
        author = (whichAuthor === 'A') ? conv.authorAName : conv.authorBName;

    let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
      "Saturday", "Sunday"];

    return (
      <div>
        <span className="variable">{author} </span>
        sent <span className="variable">{messages} </span>
        messages on a {days[dayIndex]}.
      </div>
    );
  }

  renderDoubleRTHist () {
    let value = this.props.infoToShow[0],
        bucket = this.props.infoToShow[1],
        whichAuthor = this.props.infoToShow[2],
        conv = this.props.conversation,
        buckets = conv.getResponseTimesBuckets(),
        author = (whichAuthor === 'A') ? conv.authorAName : conv.authorBName;

    return (
      <div>
        <span className="variable">{author} </span>
        responded to <span className="variable">{value} </span>
        messages within this time range.
      </div>
    );
  }

  renderWordsTime () {
    let value = this.props.infoToShow[0].words,
        date = this.props.infoToShow[0].datetime,
        whichAuthor = this.props.infoToShow[2],
        conv = this.props.conversation,
        author = (whichAuthor === 'A') ? conv.authorAName : conv.authorBName;

    return (
      <div>
        <span className="variable">{author} </span>
        sent <span className="variable">{value} </span>
        words on <span className="variable">{date} </span>.
      </div>
    );
  }

  render ()  {
    return (
      <div className={this.getClasses()}>
        {this.renderInfo()}
      </div>
    )
  }
}
