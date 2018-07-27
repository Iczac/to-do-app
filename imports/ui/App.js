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
            incomplete_count: undefined,
            search_text: ""
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        const priority = parseInt(ReactDOM.findDOMNode(this.refs.priority_select).value);
        const company = parseInt(this.state.company);

        let task_count = Tasks.find({company_id: this.state.company}).count()
        let status_msg = document.getElementById('status_msg');

        let company_check = Companies.find({id: this.state.company}).count();
        if (!company_check) {
            this.setState({
                company: 0
            })
        }

        if (this.state.company !== 0) {
            if (task_count >= 10) {
                status_msg.innerHTML = 'You can only add 10 Tasks per Company';            
                status_msg.style.border = '10px solid red';
                status_msg.style.backgroundColor = 'red';
                status_msg.style.display = 'block';
                return true
            }
        } else {
            status_msg.innerHTML = 'Please Select a company';            
            status_msg.style.border = '10px solid red';
            status_msg.style.backgroundColor = 'red';
            status_msg.style.display = 'block';
            return true
        }

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
        if (new_id > 10) {
            status_msg.innerHTML = "You can't add more than 10 companies";            
            status_msg.style.border = '10px solid red';
            status_msg.style.backgroundColor = 'red';
            status_msg.style.display = 'block';
        } else {
            status_msg.style.display = 'none';
            Companies.insert({
                id: new_id,
                name: text,
                createdAt: new Date()
            })
            ReactDOM.findDOMNode(this.refs.comInput).value = "";
        }
        
    }

    handleComOnChange(event) {
        event.preventDefault();
        let status_msg = document.getElementById('status_msg');
        status_msg.style.display = 'none';
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
        if (event.target.id !== 'title-head' && event.target.id !== 'company-add') {
            event.target.classList.add("c-activated")
            this.setState({
                company: id,
                company_name: company_name.name,
                incomplete_count: incomplete_count
            })
        }
        
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

    handleSearchText(event) {
        
        let search_text = ReactDOM.findDOMNode(this.refs.searchInput).value.trim()
        if (search_text.length > 0) {
            this.setState({
                search_text: search_text
            })
        } else {
            this.setState({
                search_text: ""
            })
        }
    }

    renderTasks() {
        const company = parseInt(this.state.company);
        let filteredTasks;
        
        if (this.state.search_text === "") {
            if (company === 0) {
                filteredTasks = Tasks.find({}).fetch()
            } else {
                filteredTasks = Tasks.find({"company_id" : company}).fetch()
            }
        } else {
            if (company === 0) {
                filteredTasks = Tasks.find({'text': {'$regex': this.state.search_text, '$options': 'i'}})
            } else {
                filteredTasks = Tasks.find({'$and': [{company_id: this.state.company}, {'text': {'$regex': this.state.search_text, '$options': 'i'}}]})
            }
            
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
                    <ListGroup style={{position: "fixed"}} onClick={this.handleComOnChange.bind(this)}>
                    <ListGroupItem id="title-head" className="list-group-head c-head">Companies</ListGroupItem>
                    <ListGroupItem className="c-list c-activated" value="0" href="#">All</ListGroupItem>
                    {this.renderCompanies()}
                    <ListGroupItem>
                        <form className="new-task" onSubmit={this.handleCompanySubmit.bind(this)} >
                            <input
                            id="company-add"
                            type="text"
                            ref="comInput"
                            placeholder="Add new Company"
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
                <Col md={2}>
                    <div className="search-task">
                        <input
                        onChange={this.handleSearchText.bind(this)}
                        style={{position: "fixed"}}
                        type="text"
                        ref="searchInput"
                        placeholder="Search Task"
                        />
                    </div>     
                </Col>
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