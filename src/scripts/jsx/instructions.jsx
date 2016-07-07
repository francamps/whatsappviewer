'use strict';

import WidgetTitle from './widget-title';

export default class Instructions extends React.Component {
  render () {
    return (
      <div className="instructions widget">
        <h3>How to use this</h3>
        <p>To use this dashboard, you'll have to use your own whatsapp
        app to email the conversation you'd like to explore to yourself. For the moment, IT'LL ONLY WORK WITH CONVERSATIONS ONE ON ONE</p>
        <ol>
          <li>Open your Whatsapp and enter the conversation you'd like to explore.</li>
          <li>On the top right, tap on the settings icon (a three-dot icon)
            on the corner. </li>
          <li>Tap on 'More', and then 'Email conversation'.</li>
          <li>Write the email address you'd like to receive your file on
            (such as your own email). Shortly	after, you will receive an email
            with a *.txt attached. </li>
          <li>Open that file and paste the text into the following form to start. </li>
        </ol>
      </div>
    )
  }
}
