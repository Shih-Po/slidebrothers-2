import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import CasePtt from '../api/case_ptt/collections';
import Tasks from '../api/tasks';

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

    Tasks.insert({
      text,
      createdAt: new Date(), // current time
    });

    // Clear form
    this.textInput.value = '';
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    >});
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

  renderCasePtt() {
    return this.props.casePtt.map(c => (
        <Case key={c._id} case={c} />
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
          id="checkbox-hide-completed"
          readOnly
          checked={this.state.hideCompleted}
          onClick={this.toggleHideCompleted}
        />
        <label className="hide-completed" htmlFor="checkbox-hide-completed">
          Hide Completed Tasks
        </label>

        <form className="new-task" onSubmit={this.handleSubmit} >
          <input
            type="text"
            ref={(c) => { this.textInput = c; }}
            placeholder="Type to add new tasks"
          />
        </form>

        <ul>
          {this.renderTasks()}
        </ul>

        <ul>
          {this.renderCasePtt()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  casePtt: PropTypes.array.isRequired,
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
};

export default createContainer(() => {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
  };
}, App);
