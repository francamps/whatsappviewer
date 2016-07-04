'use strict'

export default class Legend extends React.Component {
  render () {
    return (
      <div id="legend" className="widget legend">
        <div id="author-A-col" className="legend-col"></div>
        <div id="author-A-leg-label" className="legend-label">unknown</div>
        <div id="author-B-col" className="legend-col"></div>
        <div id="author-B-leg-label" className="legend-label">unknown</div>
      </div>
    );
  }
}
