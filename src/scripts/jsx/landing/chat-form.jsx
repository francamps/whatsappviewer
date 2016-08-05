'use strict';

export default class ChatForm extends React.Component{
  constructor (props) {
    super(props);
    this.state = {
      chatValue: ''
    }
  }

  onClickRender (event) {
    event.preventDefault();

    let text = this.state.chatValue;

    this.props.onClickRender(text);
  }

  handleChange (event) {
    this.setState({chatValue: event.target.value});
  }

  render () {
    return (
      <form id="form" className="form" onSubmit={this.onClickRender.bind(this)}>
        <textarea type="text"
          rows="10"
          placeholder="Paste your conversation here"
          value={this.state.chatValue}
          onChange={this.handleChange.bind(this)}></textarea>
        <button
          type="submit"
          id="render-button">See the data</button>
      </form>
    )
  }
}
