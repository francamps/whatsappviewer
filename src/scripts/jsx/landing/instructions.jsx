'use strict';

export default class Instructions extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    let classes = "instructions";
    classes += (this.props.isShowing) ? " showing" : " hidden";

    return (
      <div className={classes}>
        <p>For <b>Android</b> users:</p>
        <ol>
          <li>Open your Whatsapp and enter the conversation you'd like to explore.</li>
          <li>On the top right, tap on the settings icon (a three-dot icon)
            on the corner. </li>
          <li>Tap on 'More', and then 'Email conversation'.</li>
          <li>Write the email address you'd like to receive your file on
            (such as your own email). Shortly	after, you will receive an email
            with a *.txt attached. </li>
          <li>Open that file and paste the text into the following form to start. </li>
          <li>(For more info, see here <a href="https://www.whatsapp.com/faq/en/android/23756533">https://www.whatsapp.com/faq/en/android/23756533</a>)</li>
        </ol>
        <p>For <b>iOS</b> users:</p>
          <ol>
            <li>Open the WhatsApp conversation you want to email.</li>
            <li>Tap the contact's name or group subject in the navigation bar.</li>
            <li>At the bottom of the screen, tap on 'Export Chat'.</li>
            <li>Write the email address you'd like to receive your file on
              (such as your own email). Shortly	after, you will receive an email
              with a *.txt attached. </li>
            <li>Open that file and paste the text into the following form to start. </li>
            <li>(For more info, see here <a href="https://www.whatsapp.com/faq/en/iphone/20888066#email">https://www.whatsapp.com/faq/en/iphone/20888066#email</a>)</li>
          </ol>
      </div>
    )
  }
}
