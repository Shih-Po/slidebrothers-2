import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Cases104 from '../api/cases_104/collections';
import Cases518 from '../api/cases_518/collections';
import CasesPtt from '../api/cases_ptt/collections';

import Case104 from './Case104.jsx';
import Case518 from './Case518.jsx';
import CasePtt from './CasePtt.jsx';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.state = {
      hideCompleted: false,
      keyword: '',
      cases104Count: 0,
      cases518Count: 0,
      casesPttCount: 0,
    };
  }

  handleKeyUp(event) {
    event.preventDefault();

    const text = this.textInput.value.trim();

    const cases104 = this.props.cases104.filter(
      case104 => case104.title && case104.title.includes(text),
    );

    const cases518 = this.props.cases518.filter(
      case518 => case518.title && case518.title.includes(text),
    );

    const casesPtt = this.props.casesPtt.filter(
      casePtt => casePtt.title && casePtt.title.includes(text),
    );

    this.setState({
      cases104Count: cases104.length,
      cases518Count: cases518.length,
      casesPttCount: casesPtt.length,
      keyword: text,
    });
  }

  renderCases104() {
    return this.props.cases104
      .filter(case104 => case104.title && case104.title.includes(this.state.keyword))
      .map(case104 => (<Case104 key={case104._id} case104={case104} />));
  }

  renderCases518() {
    return this.props.cases518
      .filter(case518 => case518.title && case518.title.includes(this.state.keyword))
      .map(case518 => (<Case518 key={case518._id} case518={case518} />));
  }

  renderCasesPtt() {
    return this.props.casesPtt
      .filter(casePtt => casePtt.title && casePtt.title.includes(this.state.keyword))
      .map(casePtt => (<CasePtt key={casePtt._id} casePtt={casePtt} />));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>接案佈告欄</h1>
        </header>

        <div className="row">
          <div className="input-field col s10 offset-s1">
            <input
              id="input-text"
              type="text"
              ref={(c) => { this.textInput = c; }}
              onKeyUp={this.handleKeyUp}
            />
            <label htmlFor="input-text">搜尋案件</label>
          </div>
        </div>

        <div className="row">
          <div className="col s4">
            <li>104 ({this.props.cases104Count})</li>
            <ul>
              {this.renderCases104()}
            </ul>
          </div>
          <div className="col s4">
            <li>518 ({this.props.cases518Count})</li>
            <ul>
              {this.renderCases518()}
            </ul>
          </div>
          <div className="col s4">
            <li>Ptt ({this.props.casesPttCount})</li>
            <ul>
              {this.renderCasesPtt()}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  cases104: PropTypes.arrayOf(Object).isRequired,
  cases518: PropTypes.arrayOf(Object).isRequired,
  casesPtt: PropTypes.arrayOf(Object).isRequired,
  cases104TotalCount: PropTypes.number.isRequired,
  cases518TotalCount: PropTypes.number.isRequired,
  casesPttTotalCount: PropTypes.number.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('tasks');
  Meteor.subscribe('case_104');
  Meteor.subscribe('case_518');
  Meteor.subscribe('case_ptt');

  return {
    cases104: Cases104.find({}, { sort: { _id: -1 } }).fetch(),
    cases518: Cases518.find({}, { sort: { _id: -1 } }).fetch(),
    casesPtt: CasesPtt.find({}, { sort: { _id: -1 } }).fetch(),
    cases104TotalCount: Cases104.find().count(),
    cases518TotalCount: Cases518.find().count(),
    casesPttTotalCount: CasesPtt.find().count(),
  };
}, App);
