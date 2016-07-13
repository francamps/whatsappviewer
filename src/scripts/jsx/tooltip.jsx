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
    }
  }

  renderTimeOfDayInfo () {
    let messages = this.props.infoToShow[0],
        bubble = this.props.infoToShow[1],
        author = this.props.infoToShow[2];

    return (
      <span>{`Bubble ${bubble} shows ${messages} messages by author ${author}.`}</span>
    );
  }

  renderDoubleRTHist () {
    let value = this.props.infoToShow[0],
        bucket = this.props.infoToShow[1],
        whichAuthor = this.props.infoToShow[2],
        conv = this.props.conversation,
        buckets = conv.getResponseTimesBuckets(),
        author;

    if (whichAuthor === 'A') {
      author = conv.authorAName;
    } else {
      author = conv.authorBName;
    }

    return (
      <div>
        <span className="variable">{author} </span>
        sent <span className="variable">{value} </span>
        messages within this response time range.
      </div>
    )
  }

  render ()  {
    return (
      <div className={this.getClasses()}>
        {this.renderInfo()}
      </div>
    )
  }
}
