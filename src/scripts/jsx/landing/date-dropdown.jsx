'use strict';

import getDateFormats from '../../utilities/date-formats';

export default class DateDropDown extends React.Component{
  constructor (props) {
    super(props);
  }

  printDateSample (format) {
    return d3.timeFormat(format)(new Date('09/19/2016 09:50:00'));
  }

  printOption (date) {
    return (
      <option value={date}>{this.printDateSample(date)}</option>
    );
  }

  renderOptions () {
    return [
      <option selected="true" disabled="disabled">Choose a date format</option>,
      <option disabled="disabled">/* ----- Day number first (Non-US) ----- */</option>,
      getDateFormats()['EU'].map((date) => this.printOption(date)),
      <option disabled="disabled">/* ----- Month first (US) ----- */</option>,
      getDateFormats()['US'].map((date) => this.printOption(date)),
      <option disabled="disabled">/* ----- Others ----- */</option>,
      getDateFormats()['UN'].map((date) => this.printOption(date))
    ];
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
