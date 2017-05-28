import PropTypes from 'prop-types';
import React from 'react';
import { Mongo } from 'meteor/mongo';
import { createContainer } from 'meteor/react-meteor-data';

import Cases from '../api/cases/collections';

class CasePage extends React.Component {
  renderDetail() {
    return Object.entries(this.props.aCase).slice(1).map((entry) => {
      const key = entry[0];
      const value = entry[1];
      if (key === '_id' || key === 'title' || key === 'content' || key === 'link' || key === 'url') return null;
      return (
        <tr>
          <td className="case-detail">{key.replace('_', ' ').toUpperCase()} : {value ? value.toString() : ''}</td>
        </tr>
      );
    });
  }

  renderTitle() {
    return Object.entries(this.props.aCase).find(entry => entry[0] === 'title')[1];
  }

  renderContent() {
    const content = Object.entries(this.props.aCase).find(entry => entry[0] === 'content')[1];
    return content.split('\n').map(p => (<span>{p}<br /></span>));
  }

  renderHref() {
    return Object.entries(this.props.aCase).find(entry => entry[0] === 'link' || entry[0] === 'url')[1];
  }

  render() {
    return (
      <div className="case-page">
        <table className="highlight">
          <tbody>
            <tr>
              <td className="case-title">
                {this.renderTitle()} <br />
                <a
                  className="waves-effect waves-light btn"
                  href={this.renderHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                >接案去!</a>
              </td>
            </tr>
            <tr><td className="case-content">{this.renderContent()}</td></tr>
            {this.renderDetail()}
          </tbody>
        </table>
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
