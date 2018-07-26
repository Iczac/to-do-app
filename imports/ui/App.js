import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks.js';
import { Companies } from '../api/companies.js';
import Task from './Task.js';
import { Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import Company from './Company.js';
import $ from 'jquery';

 
// App component - represents the whole app
class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false,
            company: 0,
            company_name: "All Companies",
            incomplete_count: undefined
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        const priority = parseInt(ReactDOM.findDOMNode(this.refs.priority_select).value);
        const company = parseInt(this.state.company);


        let status_msg = document.getElementById('status_msg');
        if (text.length < 5) {
            status_msg.innerHTML = 'To-Do Text must be longer than 5 Characters';            
            status_msg.style.border = '10px solid red';
            status_msg.style.backgroundColor = 'red';
            status_msg.style.display = 'block';
        } else {
            Tasks.insert({
                text,
                priority: priority,
                company_id: company,
                checked: false,
                createdAt: new Date(),
            });
            let incomplete_count = Tasks.find({ company_id: this.state.company , checked: { $ne: true } }).count()
            this.setState({incomplete_count: incomplete_count})
            status_msg.innerHTML = 'To-Do Text inserted';
            status_msg.style.border = '10px solid green';
            status_msg.style.backgroundColor = 'green';
            status_msg.style.display = 'block';
            // Clear form
            ReactDOM.findDOMNode(this.refs.textInput).value = '';
        }
    }

    handleCompanySubmit(event) {
        event.preventDefault();
        const text = ReactDOM.findDOMNode(this.refs.comInput).value.trim();
        const new_id = (Companies.find({}).count() + 1)
        Companies.insert({
            id: new_id,
            name: text,
            createdAt: new Date()
        })
        ReactDOM.findDOMNode(this.refs.comInput).value = "";
    }

    handleComOnChange(event) {
        event.preventDefault();
        let act_html = document.getElementsByClassName("c-activated");
        if (act_html.length > 0) {
            act_html[0].classList.remove("c-activated");
        } 
        let id = parseInt(event.target.getAttribute("value"))
        let incomplete_count;
        if (id === 0) {
            incomplete_count = Tasks.find({ checked: { $ne: true } }).count()
        } else {
            incomplete_count = Tasks.find({ company_id: id, checked: { $ne: true } }).count()
        }
        
        let company_name = Companies.find({ id: id },{ name : 1 })

        event.target.classList.add("c-activated")
        this.setState({
            company: id,
            company_name: company_name.name,
            incomplete_count: incomplete_count
        })
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }

    renderCompanies() {
        let companies = this.props.companies;
        return companies.map((company)=>(
            <Company key={company._id} value={company.id} company={company} />
        ));
    }

    renderTasks() {
        const company = parseInt(this.state.company);
        let filteredTasks;
        if (company === 0) {
            filteredTasks = Tasks.find({}).fetch()
        } else {
            filteredTasks = Tasks.find({"company_id" : company}).fetch()
        }
        
        return filteredTasks.map((task) => (
            <Task key={task._id} task={task} />
        ));
    }

    render() {
        return (
            <Row>
                <Col md={1}></Col>
                <Col md={2}>
                    <ListGroup onClick={this.handleComOnChange.bind(this)}>
                    <ListGroupItem className="c-head">Companies</ListGroupItem>
                    <ListGroupItem className="c-list c-activated" value="0" href="#">All</ListGroupItem>
                    {this.renderCompanies()}
                    <ListGroupItem>
                        <form className="new-task" onSubmit={this.handleCompanySubmit.bind(this)} >
                            <input
                            type="text"
                            ref="comInput"
                            placeholder="Type to add new company"
                            />
                        </form>
                    </ListGroupItem>
                    </ListGroup>
                </Col>
                <Col md={6}>
                    
                    <header>
                        <h3 style={{
                                    display:'none', 
                                    backgroundColor: 'red', 
                                    color: 'white',
                                    textAlign: 'center',
                                    border: '10px solid red',
                                    borderRadius: '10px'}} id='status_msg'></h3>
                        <h1>{this.state.company_name} To Do List ({this.state.incomplete_count === undefined ? this.props.incompleteCount : this.state.incomplete_count})</h1>
                        <label className="hide-completed">
                            <input
                            type="checkbox"
                            readOnly
                            checked={this.state.hideCompleted}
                            onClick={this.toggleHideCompleted.bind(this)}
                            />
                            Hide Completed Tasks
                        </label>
                        <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                            <input
                            type="text"
                            ref="textInput"
                            placeholder="Type to add new tasks"
                            />
                            <label>
                                <span>Select Priority for New Task </span> 
                                <select ref="priority_select">
                                    <option value="0">Priority</option>
                                    <option value="3">High</option>
                                    <option value="2">Medium</option>
                                    <option value="1">low</option>
                                </select>
                            </label>
                        </form>
                    </header>

                    <ul>
                        {this.renderTasks()}
                    </ul>
                    
                </Col> 
                <Col md={2}></Col>
                </Row>
        );
    }
}

export default withTracker(() => {
    return {
        tasks: Tasks.find({}, {sort: { priority: -1 }}).fetch(),
        companies: Companies.find({}).fetch(),
        incompleteCount: Tasks.find({ checked: { $ne: true } }).count()
    };
})(App);