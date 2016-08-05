'use strict';

export default class Whatsthis extends React.Component {
  render () {
    return (
      <div id="whatsthis-wrapper" className="whatsthis-wrapper">
        <div className="widget">
          <h2>Chat analytics</h2>
          <div className="row">
            <h3>Analyze your whatsapp conversations</h3>
            <p>Find out which are your communications patterns, when do you write most often or the profile your conversation had with a person.</p>
            <img src="./assets/thumbnail01.png" />
          </div>
          <div className="row">
            <h3>Get some insight in what the hell is going on</h3>
            <p>Yeah.</p>
          </div>
          <div className="row">
            <img src="./assets/thumbnail03.png" />
            <h3>Do this for a second before moving on to something else</h3>
            <p>For real.</p>
          </div>
        </div>
      </div>
    );
  }
}
