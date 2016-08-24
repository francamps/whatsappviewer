'use strict';

export default class FAQ extends React.Component {
  render () {
    return (
      <div id="faq-wrapper" className="faq-wrapper">
        <div className="widget">
          <h2>FAQ's</h2>
          <h3>Should I take this seriously?</h3>
          <p>Yes and no. This is just supposed to be a fun and exploratory project. Don't make any stupid personal decisions based on what you see here.</p>

          <h3>Will you add support for group chats?</h3>
          <p>That's the plan. Hopefully soon enough! Right now you can add group chat to analyze, but I will ignore anything beyond the first 2 authors in it.</p>

          <h3>What are you doing with my data?</h3>
          <p>Nothing! Your chat data is not even hitting the server. It's all happening in the frontend, so you don't have to worry about privacy stuff. I wanted it this way. But don't take my word for it, go see <a href="https://github.com/francamps/whatsappviewer">the source code</a>.</p>

          <h3>Why did you do this?</h3>
          <p>I took some time off and felt like having a project I could take on to learn new stuff. I had been doing large prints about <a href="http://franc.ly/#/projects/whatsapp?_k=9v8u55">my own WhatsApp conversations</a>, so this just came as a spin off of that.</p>

          <h3>I have more questions!</h3>
          <p>Shoot me an email at hi ad franc dot ly, <a href="http://www.twitter/com/francamps">tweet</a> at me or buy me a beer.</p>

          <h3>We're WhatsApp the company and want to sue you for something you don't even understand.</h3>
          <p>Sure, I'll take down the website.</p>
        </div>
      </div>
    );
  }
}
