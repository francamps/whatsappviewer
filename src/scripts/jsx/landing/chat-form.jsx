'use strict';

import DateDropDown from './date-dropdown';
import Notification from '../notification';

export default class ChatForm extends React.Component{
  constructor (props) {
    super(props);
    this.state = {
      chatValue: '',
      dateFormat: false
    }
  }

  onClickRender (event) {
    event.preventDefault();

    let text = this.state.chatValue,
        dateFormat = this.state.dateFormat;

    this.props.onClickRender(text, dateFormat);
  }

  handleChange (event) {
    this.setState({chatValue: event.target.value});
  }

  changeDateFormat (event) {
    this.setState({dateFormat: event.target.value});
  }

  renderNotification () {
    if (this.props.parsingError) {
      return (
        <Notification
          type={this.props.notificationType || 'warning'}
          message={this.props.parsingError} />
      );
    }
  }

  renderDropDown () {
    if (this.props.parsingError) {
      return (
        <DateDropDown
          onChangeFormat={this.changeDateFormat.bind(this)}
        />
      );
    }
  }

  render () {
    return (
      <form id="form" className="form" onSubmit={this.onClickRender.bind(this)}>
        <textarea type="text"
          rows="10"
          placeholder="Paste your conversation here"
          value={this.state.chatValue}
          onChange={this.handleChange.bind(this)}></textarea>
        {this.renderNotification()}
        {this.renderDropDown()}
        <button
          type="submit"
          id="render-button">See the data</button>
      </form>
    )
  }
}
