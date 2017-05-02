import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Cases104 from '../api/cases_104/collections';
import Cases518 from '../api/cases_518/collections';
import CasesPtt from '../api/cases_ptt/collections';
import Tasks from '../api/tasks';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

import Case104 from './Case104.jsx';
import Case518 from './Case518.jsx';
import CasePtt from './CasePtt.jsx';
import Task from './Task.jsx';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      hideCompleted: false,
    };
    this.toggleHideCompleted = this.toggleHideCompleted.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = this.textInput.value.trim();

    Meteor.call('tasks.insert', text);

    // Clear form
    this.textInput.value = '';
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser ? this.props.currentUser._id : null;
      const showPrivateButton = task.owner === currentUserId;

      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }

  renderCases104() {
    return this.props.cases104.map(case104 => (
        <Case104 key={case104._id} case104={case104} />
    ))
  }

  renderCases518() {
    return this.props.cases518.map(case518 => (
        <Case518 key={case518._id} case518={case518} />
    ))
  }

  renderCasesPtt() {
    return this.props.casesPtt.map(casePtt => (
        <CasePtt key={casePtt._id} casePtt={casePtt} />
    ))
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>接案佈告欄</h1>
        </header>

        {/*<h1>Todo List ({this.props.incompleteCount})</h1>*/}

        {/*<input*/}
          {/*type="checkbox"*/}
          {/*className="filled-in"*/}
          {/*id="checkbox-hide-completed"*/}
          {/*readOnly*/}
          {/*checked={this.state.hideCompleted}*/}
          {/*onClick={this.toggleHideCompleted}*/}
        {/*/>*/}
        {/*<label className="hide-completed" htmlFor="checkbox-hide-completed">*/}
          {/*Hide Completed Tasks*/}
        {/*</label>*/}

        {/*<AccountsUIWrapper />*/}

        {/*{ this.props.currentUser ?*/}
          {/*<form className="new-task" onSubmit={this.handleSubmit} >*/}
            {/*<input*/}
              {/*type="text"*/}
              {/*ref={(c) => { this.textInput = c; }}*/}
              {/*placeholder="Type to add new tasks"*/}
            {/*/>*/}
          {/*</form> : ''*/}
        {/*}*/}

        {/*<ul>*/}
          {/*{this.renderTasks()}*/}
        {/*</ul>*/}

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
  cases104: PropTypes.array.isRequired,
  cases518: PropTypes.array.isRequired,
  casesPtt: PropTypes.array.isRequired,
  cases104Count: PropTypes.number.isRequired,
  cases518Count: PropTypes.number.isRequired,
  casesPttCount: PropTypes.number.isRequired,
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('tasks');
  Meteor.subscribe('case_104');
  Meteor.subscribe('case_518');
  Meteor.subscribe('case_ptt');

  return {
    cases104: Cases104.find({}, { limit: 50 }).fetch(),
    cases518: Cases518.find({}, { limit: 50 }).fetch(),
    casesPtt: CasesPtt.find({}, { limit: 50 }).fetch(),
    cases104Count: Cases104.find().count(),
    cases518Count: Cases518.find().count(),
    casesPttCount: CasesPtt.find().count(),
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);
