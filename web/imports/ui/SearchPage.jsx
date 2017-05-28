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
      cases104TotalCount: 0,
      cases518Count: 0,
      cases518TotalCount: 0,
      casesPttCount: 0,
      casesPttTotalCount: 0,
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
    return this.state.filteredCases.slice(0, 50)
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
          <div className="col s4">
            104 ({
              this.state.keyword ?
              this.state.cases104Count :
              this.state.cases104TotalCount
            }/{this.state.cases104TotalCount})
          </div>
          <div className="col s4">
            518 ({
            this.state.keyword ?
              this.state.cases518Count :
              this.state.cases518TotalCount
          }/{this.state.cases518TotalCount})
          </div>
          <div className="col s4">
            PTT ({
            this.state.keyword ?
              this.state.casesPttCount :
              this.state.casesPttTotalCount
          }/{this.state.casesPttTotalCount})
          </div>
          <div className="col s12">
            <div className="collection">
              {this.renderCases()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// noinspection JSUnresolvedFunction
SearchPage.propTypes = {
  cases: PropTypes.arrayOf(Object).isRequired,
};


export default createContainer(() => {
  subsManager.subscribe('cases');

  return {
    cases: Cases.find({}, { sort: { post_date: -1 } }).fetch(),
  };
}, SearchPage);
