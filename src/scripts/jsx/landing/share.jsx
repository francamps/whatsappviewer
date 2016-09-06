'use strict';

export default class Whatsthis extends React.Component {
  render () {
    return (
      <div id="share-wrapper" className="share-wrapper">
        <div className="widget">
          <h2>Share me with your peeps!</h2>
          <p>If you've found this interesting, let your peoples know about it.</p>
          <div className="share">
            <a href="https://twitter.com/share" className="twitter-share-button" data-show-count="false">Tweet</a>
            <script async src="http://platform.twitter.com/widgets.js" charset="utf-8"></script>
          </div>
        </div>
      </div>
    );
  }
}
