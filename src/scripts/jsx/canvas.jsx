'use strict';

import Legend from './legend';
import DataTable from './data-table';

export default class Canvas extends React.Component {
  render () {
    return (
      <div id="canvas" className="canvas hidden">
        <div id="dashboard-title" className="widget-title">
          <p>Your conversation</p>
        </div>
        <Legend />
        <div className="widget">
          <h3>Volume of messages over time</h3>
          <div id="graph-viewer" className="graph-widget"></div>
          <form id="search-form" className="form">
            <input id="search-box" type="text" placeholder="Search a word or phrase"></input>
          </form>
        </div>
        <div id="widget-2" className="widget">
          <h3>Volume of messages per hour of day</h3>
          <div></div>
        </div>
        <div id="widget-3" className="widget">
          <h3>Response times per day (average)</h3>
          <div className="svg"></div>
        </div>
        <DataTable />
      </div>
    );
  }
}
