import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Tasks from '../api/tasks';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

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

    Tasks.insert({
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),           // _id of logged in user
      username: Meteor.user().username,  // username of logged in user
    });

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
    return filteredTasks.map(task => (
      <Task key={task._id} task={task} />
    ));
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
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
};

export default createContainer(() => {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
  };
}, App);
