'use strict';

import Form from './landing/form';
import FAQ from './landing/faq';
import Share from './landing/share';

export default class Landing extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      classes: "landing-wrapper"
    }
  }

  showForm () {
    this.setState({
      classes: "landing-wrapper"
    });
  }

  hideForm () {
    this.setState({
      classes: "landing-wrapper hidden"
    });
  }

  componentWillUnmount () {
    if (this.props.isAnalyzed) {
      this.hideForm();
    }
  }

  render () {
    return (
      <div id="landing-wrapper" className={this.state.classes}>
        <div className="top-logo">
          <img src="./assets/thumbnail05top.png" />
        </div>
        <h1 className="title">WhatsApp Explorer</h1>
        <h2>See revealing analytics about your chat communication habits</h2>
        <Form
          parsingError={this.props.parsingError}
          isAnalyzed={this.props.isAnalyzed}
          onClickRender={this.props.onClickRender}/>
        <FAQ />
        <Share />
      </div>
    );
  }
}
