'use strict';

export default class WidgetTitle extends React.Component {
  render () {
    return (
      <div className="widget-title">
        <p>{this.props.title}</p>
      </div>
    );
  }
}
