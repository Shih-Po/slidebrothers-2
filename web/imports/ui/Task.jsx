import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// Task component - represents a single todo item
export default class Task extends Component {
  constructor() {
    super();
    this.toggleChecked = this.toggleChecked.bind(this);
    this.togglePrivate = this.togglePrivate.bind(this);
    this.deleteThisTask = this.deleteThisTask.bind(this);
  }

  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  }

  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  }

  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.private);
  }

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private,
    });

    return (
      <li className={taskClassName}>
        <a className="delete btn" onClick={this.deleteThisTask}>
          &times;
        </a>

        { this.props.showPrivateButton ? (
          <a className="toggle-private btn" onClick={this.togglePrivate}>
            { this.props.task.private ? 'Private' : 'Public' }
          </a>
        ) : ''}

        <input
          type="checkbox"
          className="filled-in"
          id={this.props.task._id}
          readOnly
          checked={this.props.task.checked}
          onClick={this.toggleChecked}
        />
        <label className="text" htmlFor={this.props.task._id}>
          <strong>{this.props.task.username}</strong>: {this.props.task.text}
        </label>
      </li>
    );
  }
}

Task.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  task: PropTypes.object.isRequired,
  showPrivateButton: PropTypes.bool.isRequired,
};
