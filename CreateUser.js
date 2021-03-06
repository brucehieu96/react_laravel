// resources/assets/js/components/CreateUser.js

import React, { Component } from 'react'
import App from './App'
import axios from 'axios'

class CreateUser extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',
      authority: '',
      file: '',
      fileName: '',
      imagePreviewUrl: ''
    }

    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangeEmail = this.handleChangeEmail.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleChangeAuthority = this.handleChangeAuthority.bind(this)
    this.handleImageChange = this.handleImageChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangeName (e) {
    this.setState({
      name: e.target.value
    })
  }

  handleChangeEmail (e) {
    this.setState({
      email: e.target.value
    })
  }

  handleChangePassword (e) {
    this.setState({
      password: e.target.value
    })
  }

  handleChangeAuthority (e) {
    this.setState({
      authority: e.target.value
    })
  }

  handleImageChange(e) {
    e.preventDefault()
    let reader = new FileReader();
    let file = e.target.files[0];
    
    reader.onloadend = () => {
      this.setState({
        file: reader.result,
        fileName: file.name,
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(file)
  }

  handleSubmit (e) {
    e.preventDefault()
    let url = window.Laravel.baseUrl + '/api/users'
    const data = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      authority: this.state.authority,
      profile: this.state.file,
      image: this.state.fileName
    }
    axios.post(url, data)
      .then(response => {
        if (response.status){
          this.props.history.push('/users');
        } else {
          alert(response.error);
      }
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  render () {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

    return (
      <App>
        <h1>Create An User</h1>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label htmlFor='name'>Name</label>
            <input type='text' className='form-control' id='name' placeholder='Name'
              value={this.state.name} onChange={this.handleChangeName} required />
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='email' className='form-control' id='email' placeholder='Email'
              value={this.state.email} onChange={this.handleChangeEmail} required />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input type='password' className='form-control' id='password' placeholder='Password'
              value={this.state.password} onChange={this.handleChangePassword} required />
          </div>
          <div className='form-group'>
            <label htmlFor='authority'>Authority</label>
            <select className="form-control" id="authority" onChange={this.handleChangeAuthority}>
              <option value="">Select a value</option>
              <option value="1">Top</option>
              <option value="0">Standard</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='profile'>Profile Image</label>
            <input className="form-control fileInput" 
            type="file" 
            onChange={this.handleImageChange} />
          </div>
          <div className="imgPreview">
            {$imagePreview}
          </div>
          <button type='submit' className='btn btn-primary'>Add User</button>
        </form>
      </App>
    )
  }
}
export default CreateUser