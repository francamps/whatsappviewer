'use strict';

export default class Instructions extends React.Component {
  render () {
    return (
      <div className="instructions">
        <h2>Get some insight into your daily WhatsApp conervsations</h2>
        <h3>How to use this</h3>
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
