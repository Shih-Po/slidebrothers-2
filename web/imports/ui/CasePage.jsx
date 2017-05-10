import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Mongo } from 'meteor/mongo';
import { createContainer } from 'meteor/react-meteor-data';

import Cases104 from '../api/cases_104/collections';
import Cases518 from '../api/cases_518/collections';
import CasesPtt from '../api/cases_ptt/collections';

class CasePage extends Component {
  renderDetail() {
    return Object.entries(this.props.aCase).map(entry => <li>{entry[1].toString()}</li>);
  }

  render() {
    return (
      <div className="case-page">
        <ul>
          {this.renderDetail()}
        </ul>
      </div>
    );
  }
}

CasePage.propTypes = {
  aCase: PropTypes.shape().isRequired,
};

export default createContainer(({ _id, type }) => {
  const props = {};
  const caseId = new Mongo.ObjectID(_id);
  switch (type) {
    case '104':
      props.aCase = Cases104.findOne(caseId);
      break;
    case '518':
      props.aCase = Cases518.findOne(caseId);
      break;
    case 'ptt':
      props.aCase = CasesPtt.findOne(caseId);
      break;
    default:
      break;
  }
  return props;
}, CasePage);
