'use strict';

export default class WidgetTitle extends React.Component {
  render () {
    return (
      <div className="section-title">
        <h2>{this.props.title}</h2>
      </div>
    );
  }
}
