import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import CasesPtt from '../api/cases_ptt/collections';
import Tasks from '../api/tasks';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

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

  renderCasesPtt() {
    return this.props.casesPtt.map(casePtt => (
        <CasePtt key={casePtt._id} casePtt={casePtt} />
    ))
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>
        </header>

        <h1>Todo List ({this.props.incompleteCount})</h1>

        <input
          type="checkbox"
          className="filled-in"
          id="checkbox-hide-completed"
          readOnly
          checked={this.state.hideCompleted}
          onClick={this.toggleHideCompleted}
        />
        <label className="hide-completed" htmlFor="checkbox-hide-completed">
          Hide Completed Tasks
        </label>

        <AccountsUIWrapper />

        { this.props.currentUser ?
          <form className="new-task" onSubmit={this.handleSubmit} >
            <input
              type="text"
              ref={(c) => { this.textInput = c; }}
              placeholder="Type to add new tasks"
            />
          </form> : ''
        }

        <ul>
          {this.renderTasks()}
        </ul>

        <ul>
          {this.renderCasesPtt()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  casesPtt: PropTypes.array.isRequired,
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('tasks');
  Meteor.subscribe('case_ptt');

  return {
    casesPtt: CasesPtt.find().fetch(),
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);
