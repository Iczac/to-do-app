import React, { Component } from 'react'
import { Companies } from '../api/companies.js';
import { Tasks } from '../api/tasks.js';
import { ListGroupItem } from 'react-bootstrap';
import $ from 'jquery';

export default class Company extends Component {

    deleteThisCompany() {
        Tasks._collection.remove({}, {id: this.props.company.id});
        Companies.remove(this.props.company._id);
    }

    render() {
        return (
            <ListGroupItem className="c-list" value={this.props.company.id} href="#">
            {this.props.company.name}
            <button className="delete" onClick={this.deleteThisCompany.bind(this)}>
                &times;
            </button>
            </ListGroupItem>
        )
    }
}