'use strict';

export default class DataTable extends React.Component {
  render () {
    return (
      <div className="widget">
        <h3>Additional metrics</h3>
        <div className="data-table">
          <div className="row">
            <div id="author-A" className="cell"></div>
            <div className="cell metric-label"></div>
            <div id="author-B" className="cell"></div>
          </div>
          <div className="row">
            <div id="word-count-A" className="cell metric"></div>
            <div className="cell metric-label">Words per message (avg / median)</div>
            <div id="word-count-B" className="cell metric"></div>
          </div>
          <div className="row">
            <div id="message-num-A" className="cell metric"></div>
            <div className="cell metric-label">Number of messages</div>
            <div id="message-num-B" className="cell metric"></div>
          </div>
          <div className="row">
            <div id="resp-times-A" className="cell metric"></div>
            <div className="cell metric-label">Response times frequency</div>
            <div id="resp-times-B" className="cell metric"></div>
          </div>
          <div className="row">
            <div id="resp-times-chat-A" className="cell metric"></div>
            <div className="cell metric-label">Response times frequency in chat mode</div>
            <div id="resp-times-chat-B" className="cell metric"></div>
          </div>
        </div>
      </div>      
    )
  }
}
