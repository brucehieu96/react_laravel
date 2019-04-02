// resources/assets/js/components/UserRow.js

import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class UserRow extends Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }
    handleDelete(e) {
        e.preventDefault();
        if (!confirm("Are your sure you want to delete this item?")) {
            return false;
        }
        let url = window.Laravel.baseUrl + "/api/users/" + this.props.obj.id;
        axios
            .delete(url)
            .then(response => {
                this.props.deleteRow(this.props.index);
            })
            .catch(function(error) {
                console.log(error);
            });
    }
    render() {
        let authority = this.props.obj.authority;
        if (authority == 0) {
            authority = 'Standard';
        } else {
            authority = 'Top';
        }
        
        return (
            <tr>
                <td>{this.props.obj.id}</td>
                <td><img src={`images/${this.props.obj.profile}`}/></td>
                <td>{this.props.obj.name}</td>
                <td>{this.props.obj.email}</td>
                <td>{authority}</td>
                <td>
                    <Link
                        className="btn btn-primary mr-2"
                        to={"/users/edit/" + this.props.obj.id}
                    >
                        Edit
                    </Link>
                    <button
                        className="btn btn-danger"
                        type="button"
                        onClick={this.handleDelete}
                    >
                        Delete
                    </button>
                </td>
            </tr>
            // <div className="col-4 admin-category-item">
            //     <div className="admin-media d-flex flex-column relative" id={this.props.obj.id}>
            //         <div className="thumbnail flex-middle">
            //             <a id={`event-${this.props.obj.id}`}>
            //                 <img src={`images/${this.props.obj.profile}`}/>
            //             </a>
            //         </div>
            //         <div className="justify-content-between mt-1">
            //             <div className="text-truncate mr-3">
            //                 <span>{this.props.obj.name}</span>
            //             </div>
            //             <div>
            //                 <a href="javascript:;" className="dropdown-toggle drop-expanded" data-toggle="dropdown" aria-expanded="false">
            //                 </a>
            //                 <div className="dropdown-menu dropdown-menu-right">
            //                     <a className="dropdown-item">
            //                         <div className="d-flex justify-content-between">
            //                             <div className="mr-4">View</div>
            //                         </div>
            //                     </a>
            //                     <a className="dropdown-item">
            //                         <div className="d-flex justify-content-between">
            //                             <div>Edit</div>
            //                         </div>
            //                     </a>
            //                     <a className="dropdown-item">
            //                         <div className="d-flex justify-content-between">
            //                             <div>Delete</div>
            //                         </div>
            //                     </a>
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            // </div>
        );
    }
}

export default UserRow;
