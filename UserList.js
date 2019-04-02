// resources/assets/js/components/UserList.js

import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import App from "./App";
import UserRow from "./UserRow";
import Pagination from './Pagination';

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: null,
            usersInit: [],
            authority: [],
            optionSearch: '',
            currentPage: 1,
            perPage: 3,
        };
        this.handleClick = this.handleClick.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.handleChangeSearchOption = this.handleChangeSearchOption.bind(this);
    }

    componentDidMount() {
        axios
            .get(window.Laravel.baseUrl + "/api/users")
            .then(response => {
                if(this.state.usersInit){
                    this.setState({
                        users: response.data,
                        usersInit: response.data
                    });
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    }
    deleteRow(key) {
        var users = [...this.state.users];
        users.splice(key, 1);
        this.setState({ users });
    }
    fetchRows(current) {
        if (current instanceof Array) {
            return current.map((object, i) => {
                return (
                    <UserRow
                        obj={object}
                        key={i}
                        index={i}
                        deleteRow={this.deleteRow.bind(this)}
                    />
                );
            });
        }
    }
    compareBy(key, order) {
        return function(a, b) {
            if (order == "desc") {
                if (a[key] < b[key]) return 1;
                if (a[key] > b[key]) return -1;
            }
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        };
    }
    sortBy(key, order) {
        let arraySorted = [...this.state.users];
        arraySorted.sort(this.compareBy(key, order));
        this.setState({ users: arraySorted });
    }
    handleClick(event) {
        if(event){
            this.setState({
                currentPage: Number(event.target.id)
            });
        }
    }
    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }
    handleChange(e) {
        // Variable to hold the original version of the list
        let currentList = [];
        // Variable to hold the filtered list before putting into state
        let newList = [];

        // If the search bar isn't empty
        if (e.target.value !== "") {
            // Assign the original list to currentList
            currentList = this.state.usersInit;

            // Use .filter() to determine which items should be displayed
            newList = currentList.filter(item => {
                // Search according to key: name, id, email
                let keySearch = '';
                let option = this.state.optionSearch;
                let lc = '';
                // change search term to lowercase
                let filter = e.target.value.toLowerCase();;
                switch(option) {
                    case 'id':
                        keySearch = String(item.id);
                        // change current item to lowercase
                        lc = keySearch.toLowerCase();
                        // check to see if the current list item includes the search term
                        return lc.includes(filter);
                    case 'email':
                        keySearch = item.email;
                        // change current item to lowercase
                        lc = keySearch.toLowerCase();
                        // check to see if the current list item includes the search term
                        return lc.includes(filter);
                    case 'name':
                        keySearch = item.name;
                        // change current item to lowercase
                        lc = keySearch.toLowerCase();
                        // check to see if the current list item includes the search term
                        return lc.includes(filter);
                    default:
                        keySearch = item.name;
                        return Object.keys(item).some(key =>
                            String(item[key]).toLowerCase().includes(filter)
                        );
                }
            });
        } else {
            // If the search bar is empty, set newList to original task list
            newList = this.state.usersInit;
        }
        // Set the filtered state based on what our rules added to newList
        this.setState({
            users: newList
        });
    }
    handleChangeSearchOption (e) {
        this.setState({
            optionSearch: e.target.value
        })
    }
    onChangeStatus(e) {
        var val = e.target.value;
        this.setState({authority: val});
    }
    paginationFiltered(items) {
        const { currentPage, perPage } = this.state;
        // Logic for displaying current todos
        const indexOfLast = currentPage * perPage;
        const indexOfFirst = indexOfLast - perPage;
        let current = items.slice(indexOfFirst, indexOfLast);
        return current;
    }

    render() {
        if (this.state.users !== null) {
            const { users, currentPage, perPage } = this.state;
            // Logic for displaying current todos
            const indexOfLast = currentPage * perPage;
            const indexOfFirst = indexOfLast - perPage;
            let current = users.slice(indexOfFirst, indexOfLast);
            
            // Logic for filter options
            var filteredItems = this.state.users;
            var state = this.state;
            var filterProperties = ['authority'];
            filterProperties.forEach(function(filterBy) {
                var filterValue = state[filterBy];
                if (filterValue.length > 0) {
                    if (filterValue != 'all') { // Filter with Authority: Top or Standard
                        filteredItems = filteredItems.filter(function(item) {
                            return item[filterBy] == filterValue;
                        });
                    }
                }
            });
            current = this.paginationFiltered(filteredItems);
            
            return (
                <App>
                    <h1>Users</h1>
                    <div className="clearfix">
                        <Link
                            className="btn btn-success pull-right"
                            to="/users/create"
                        >
                            Add User
                        </Link>
                        {/* <input
                            type="text"
                            id="search-text"
                            className="input"
                            onChange={this.handleChange.bind(this)}
                            placeholder="Search..."
                        /> */}
                        <div className="row">
                            <div className="col-6 offset-4">
                                <div className="input-group">
                                    <div className="input-group-btn search-panel">
                                        <select name="search_param" id="search_param" className="btn btn-info dropdown-toggle"
                                            onChange={this.handleChangeSearchOption} aria-expanded="false">
                                            <option value="all">All</option>
                                            <option value="name">Name</option>
                                            <option value="id">ID</option>
                                            <option value="email">Email</option>
                                        </select>
                                    </div>
                                    <input type="text" id="search-text" name="x" className="form-control" onChange={this.handleChange.bind(this)} placeholder="Search..." />
                                </div>
                            </div>
                        </div>
                        <br></br>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            Filter by Authority:
                            <select className="form-control" onChange={this.onChangeStatus.bind(this)}>
                                <option value="all">All</option>
                                <option value="1">Top</option>
                                <option value="0">Standard</option>
                            </select>
                        </div>
                    </div>
                    <br />
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>
                                    ID{" "}
                                    <i
                                        className="fa fa-sort-down"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => this.sortBy("id", "asc")}
                                    />
                                    <i
                                        className="fa fa-sort-up"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            this.sortBy("id", "desc")
                                        }
                                    />
                                </th>
                                <th>
                                    Image{" "}
                                </th>
                                <th>
                                    Name{" "}
                                    <i
                                        className="fa fa-sort-down"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            this.sortBy("name", "asc")
                                        }
                                    />
                                    <i
                                        className="fa fa-sort-up"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            this.sortBy("name", "desc")
                                        }
                                    />
                                </th>
                                <th>
                                    Email{" "}
                                    <i
                                        className="fa fa-sort-down"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            this.sortBy("email", "asc")
                                        }
                                    />
                                    <i
                                        className="fa fa-sort-up"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            this.sortBy("email", "desc")
                                        }
                                    />
                                </th>
                                <th>
                                    Authority{" "}
                                    <i
                                        className="fa fa-sort-down"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            this.sortBy("authority", "asc")
                                        }
                                    />
                                    <i
                                        className="fa fa-sort-up"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            this.sortBy("authority", "desc")
                                        }
                                    />
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>{this.fetchRows(current)}</tbody>
                    </table>
                    {/* <div className="admin-category row" id="listconsent">
                        {this.fetchRows(current)}
                    </div> */}
                    <Pagination items={filteredItems} currentPage={this.state.currentPage} perPage={this.state.perPage} onChangePage={this.handleClick} />
                </App>
            );
        } else {
            return (
                <App>
                    <h1>Users</h1>
                    <div className="clearfix">
                        <Link
                            className="btn btn-success pull-right"
                            to="/users/create"
                        >
                            Add User
                        </Link>
                        <input
                            type="text"
                            id="search-text"
                            className="input"
                            onChange={this.handleChange.bind(this)}
                            placeholder="Search..."
                        />
                        <select onChange={this.onChangeStatus}>
                            <option value="all">All</option>
                            <option value="1">Top</option>
                            <option value="0">Standard</option>
                        </select>
                    </div>
                    <br />
                    <h3>Loading...</h3>
                </App>
            );
        }
    }
}
export default UserList;
