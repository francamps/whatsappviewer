'use strict'

export default class Legend extends React.Component {
  render () {
    return (
      <div id="legend" className="legend summary-metric-section">
        <p>
          <span id="author-A-col" className="legend-col authorA"></span>
          <span id="author-A-leg-label" className="legend-label">
            {this.props.conversation.authorAName}
          </span>
        </p>
        <p>
          <span id="author-B-col" className="legend-col authorB"></span>
          <span id="author-B-leg-label" className="legend-label">
            {this.props.conversation.authorBName}
          </span>
        </p>
      </div>
    );
  }
}
