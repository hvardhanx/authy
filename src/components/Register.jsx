import React, { Component } from 'react';
import { Alert, Button, Jumbotron, Form } from 'reactstrap';
import axios from 'axios';
import { Redirect } from 'react-router';
import TextInput from './TextInput';

export default class Register extends Component {
  state = {
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    email: '',
    redirect: false
  };

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  componentDidMount() {
    this.primaryInput.focus();
  }

  onSubmit = event => {
    event.preventDefault();
    let apiBaseUrl = process.env.REACT_APP_API;
    let self = this;
    let payload = {
      "username": self.state.username,
      "password": self.state.password,
      "first_name": self.state.firstname,
      "last_name": self.state.lastname,
      "email": self.state.email
    };
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };

    axios
      .post(apiBaseUrl + 'users/register/', payload, axiosConfig)
      .then(function(res) {
        console.log(res);
        if (res.status === 201) {
          self.setState({ redirect: true });
          alert('Registration successful!');
          console.log('Register Success');
        } else {
          console.log('User not created');
          alert('Username not created');
        }
      })
      .catch(function(err) {
        console.log('Fields already exist');
        alert('Fields already exist');
      });
  };

  render() {
    const errors = this.props.errors || {};
    const redirect = this.state.redirect;
    if (redirect) {
      return (
        <Redirect
          to={{
            pathname: '/',
            state: { username: this.state.username }
          }}
        />
      );
    }
    return (
      <Jumbotron className="container">
        <Form onSubmit={this.onSubmit}>
          <h1>Register</h1>
          {errors.non_field_errors ? (
            <Alert color="danger">{errors.non_field_errors}</Alert>
          ) : (
            ''
          )}
          <TextInput
            name="username"
            label="Username"
            error={errors.username}
            getRef={input => (this.primaryInput = input)}
            onChange={this.handleInputChange}
          />
          <TextInput
            name="password"
            label="Password"
            error={errors.password}
            type="password"
            onChange={this.handleInputChange}
          />
          <TextInput
            name="firstname"
            label="First Name"
            error={errors.firstname}
            onChange={this.handleInputChange}
          />
          <TextInput
            name="lastname"
            label="Last Name"
            error={errors.lastname}
            onChange={this.handleInputChange}
          />
          <TextInput
            name="email"
            label="Email"
            error={errors.email}
            onChange={this.handleInputChange}
          />
          <Button type="submit" color="primary" size="lg">
            Register
          </Button>
        </Form>
      </Jumbotron>
    );
  }
}
