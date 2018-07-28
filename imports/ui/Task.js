import React, { Component } from 'react';
import { Tasks } from '../api/tasks.js';
import { Meteor } from 'meteor/meteor';
import $ from 'jquery';

// Task component - represents a single todo item
export default class Task extends Component {

    // Check/Uncheck task as done
    toggleChecked() {
        // Set the checked property to the opposite of its current value
        Meteor.call('tasks.toggleCheck', this.props.task._id, this.props.task.checked)
    }

    // Handling priority change
    handleChange(event) {
        let priority_no = parseInt(event.target.value)
        Meteor.call('tasks.changePriority', this.props.task._id, priority_no)
    }

    // Deleting task
    deleteThisTask() {
        Meteor.call('tasks.deleteTask', this.props.task._id)
    }

    render() {
        const taskClassName = this.props.task.checked ? 'checked' : '';
        let priority_no = this.props.task.priority;

        let priority;
        switch (priority_no) {
            case 0:
                priority = "-"
                break;
            case 1:
                priority = "Low"
                break;
            case 2:
                priority = "Medium"
                break;
            case 3:
                priority = "High"
                break;
            default:
                priority = "(-.-)"
                break;
        }

        return (
            <li className={taskClassName}>
                <select className="task_select" onChange={this.handleChange.bind(this)}>
                    <option value="0">Change Priority</option>
                    <option value="3">High</option>
                    <option value="2">Medium</option>
                    <option value="1">low</option>
                </select>
                <span className="badge badge-color" style={{float: "right"}}>{priority}</span>
                
                <button className="delete" onClick={this.deleteThisTask.bind(this)}>
                &times;
                </button>
        
                <input
                type="checkbox"
                readOnly
                checked={!!this.props.task.checked}
                onClick={this.toggleChecked.bind(this)}
                />
        
                <span className="text" style={{wordBreak: "break-all", wordWrap: "break-word"}}>{this.props.task.text}</span>
            </li>
        );
    }
}