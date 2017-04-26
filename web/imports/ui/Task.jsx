import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tasks from '../api/tasks';

// Task component - represents a single todo item
export default class Task extends Component {
  constructor() {
    super();
    this.toggleChecked = this.toggleChecked.bind(this);
    this.deleteThisTask = this.deleteThisTask.bind(this);
  }

  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Tasks.update(this.props.task._id, {
      $set: { checked: !this.props.task.checked },
    });
  }

  deleteThisTask() {
    Tasks.remove(this.props.task._id);
  }

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const taskClassName = this.props.task.checked ? 'checked' : '';

    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteThisTask}>
          &times;
        </button>

        <input
          type="checkbox"
          className="filled-in"
          id="checkbox-filled-in"
          readOnly
          checked={this.props.task.checked}
          onClick={this.toggleChecked}
        />
        <label className="text" htmlFor="checkbox-filled-in">{this.props.task.text}</label>
      </li>
    );
  }
}

Task.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  task: PropTypes.object.isRequired,
};
