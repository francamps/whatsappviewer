'use strict';

export default class ChatForm extends React.Component{
  render () {
    return (
      <div className="widget">
        <form id="form" className="form">
            <span>Paste your conversation text here:</span>
            <textarea id="text" type="text" rows="6" placeholder="Insert text"></textarea>
        </form>
        <button id="render-button">Render</button>
      </div>
    )
  }
}
