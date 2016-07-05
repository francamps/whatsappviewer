'use strict';

export default class Summary extends React.Component {
  render () {
    return (
      <div className="summary">
        <p>Total messages: 987</p>
        <p>Longest silence period: 24 days, 11h, 46min</p>
        <p>Media-based messages (ignored): 91</p>
      </div>
    );
  }
}
