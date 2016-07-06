'use strict'

import Summary from './summary';

export default class Legend extends React.Component {
  render () {
    return (
      <div id="legend" className="widget legend">
        <div id="author-A-col" className="legend-col authorA"></div>
        <div id="author-A-leg-label" className="legend-label">
          {this.props.conversation.authorAName}
        </div>
        <div id="author-B-col" className="legend-col authorB"></div>
        <div id="author-B-leg-label" className="legend-label">
          {this.props.conversation.authorBName}
        </div>
        <Summary conversation={this.props.conversation} />
      </div>
    );
  }
}
