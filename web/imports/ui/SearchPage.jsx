import PropTypes from 'prop-types';
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';

import Cases from '../api/cases/collections';

import Case from './Case.jsx';

const subsManager = new SubsManager();

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.state = {
      cases104Count: 0,
      cases518Count: 0,
      casesPttCount: 0,
      filteredCases: [],
      keyword: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const cases = nextProps.cases;

    this.setState({
      cases104TotalCount: cases.filter(aCase => aCase.source === '104').length,
      cases518TotalCount: cases.filter(aCase => aCase.source === '518').length,
      casesPttTotalCount: cases.filter(aCase => aCase.source === 'ptt').length,
      filteredCases: cases,
    });
  }

  handleKeyUp(event) {
    event.preventDefault();

    const text = this.textInput.value.trim();

    const cases = this.props.cases.filter(
      aCase => (aCase.title && aCase.title.includes(text)) || aCase.content.includes(text),
    );

    this.setState({
      cases104Count: cases.filter(aCase => aCase.source === '104').length,
      cases518Count: cases.filter(aCase => aCase.source === '518').length,
      casesPttCount: cases.filter(aCase => aCase.source === 'ptt').length,
      filteredCases: cases,
      keyword: text,
    });
  }

  renderCases() {
    const text = this.state.keyword;
    return this.props.cases
      .filter(aCase => (aCase.title && aCase.title.includes(text)) || aCase.content.includes(text))
      .slice(0, 50)
      .map(aCase => (<Case key={aCase._id} aCase={aCase} />));
  }

  render() {
    return (
      <div className="search-page">
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
          <div className="center aligned orange-text col s4">
            104 ({
              this.state.keyword ?
              this.state.cases104Count :
              this.props.cases104TotalCount
            }/{this.props.cases104TotalCount})
          </div>
          <div className="center aligned green-text col s4">
            518 ({
            this.state.keyword ?
              this.state.cases518Count :
              this.props.cases518TotalCount
          }/{this.props.cases518TotalCount})
          </div>
          <div className="center aligned purple-text col s4">
            PTT ({
            this.state.keyword ?
              this.state.casesPttCount :
              this.props.casesPttTotalCount
          }/{this.props.casesPttTotalCount})
          </div>
          <div className="col s10 offset-s1">
            <div className="collection">
              {this.renderCases()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// noinspection JSUnresolvedFunction, JSUnresolvedVariable
SearchPage.propTypes = {
  cases: PropTypes.arrayOf(Object).isRequired,
  cases104TotalCount: PropTypes.number.isRequired,
  cases518TotalCount: PropTypes.number.isRequired,
  casesPttTotalCount: PropTypes.number.isRequired,
};


export default createContainer(() => {
  subsManager.subscribe('cases');

  return {
    cases: Cases.find({}, { sort: { title: 1 } }).fetch().sort((a, b) => {
      return new Date(b.post_date.toDateString()) - new Date(a.post_date.toDateString());
    }),
    cases104TotalCount: Cases.find({ source: '104' }).count(),
    cases518TotalCount: Cases.find({ source: '518' }).count(),
    casesPttTotalCount: Cases.find({ source: 'ptt' }).count(),
  };
}, SearchPage);
