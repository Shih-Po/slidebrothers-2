import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Task component - represents a single todo item
export default class CasePtt extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <li className="case-ptt">
                <label className="text">
                    <strong>{this.props.casePtt.title}</strong>
                </label>
            </li>
        );
    }
}

CasePtt.propTypes = {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    casePtt: PropTypes.object.isRequired,
};
