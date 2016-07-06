'use strict';

export default class Widget extends React.Component {

  renderTitle () {
    return (
      <h3>{this.props.title}</h3>
    );
  }

  renderSVG () {
    if (this.props.svgID) {
      return (
        <div className="svg"></div>
      );
    }
  }

  renderSearchBox () {
    if (this.props.renderSearchBox) {
      return (
        <form id="search-form" className="form">
          <input id="search-box" type="text" placeholder="Search a word or phrase"></input>
        </form>
      );
    }
  }
  // Volume of messages per time of day
  componentDidMount () {
    if (this.props.view) {
      this.renderSVGs();
    }
  }

  renderSVGs () {
    let Convo = this.props.conversation;
    let viewParams = this.props.viewParams;
    let View = this.props.view;

    let thisView = new View({
      Convo: Convo,
      options: viewParams
    });
    thisView.render();
  }

  render () {
    return (
      <div id={this.props.svgID} className="widget">
        {this.renderTitle()}
        {this.renderSVG()}
        {this.renderSearchBox()}
      </div>
    );
  }
}
