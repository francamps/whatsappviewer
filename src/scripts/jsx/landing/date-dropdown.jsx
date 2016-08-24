'use strict';

import getDateFormats from '../../utilities/date-formats';

export default class DateDropDown extends React.Component{
  constructor (props) {
    super(props);
  }

  printDateSample (format) {
    return d3.timeFormat(format)(new Date('09/19/2016 09:50:00'));
  }

  renderOptions () {
    return getDateFormats()['EU'].map((d) => {
      return (
        <option value={d}>{this.printDateSample(d)}</option>
      );
    });
  }

  render () {
    return (
      <div className="date-selector">
        <select onChange={this.props.onChangeFormat}>
          {this.renderOptions()}
        </select>
      </div>
    );
  }
}
