import React, { Component } from 'react';
import { Alert, Button, Jumbotron, Form } from 'reactstrap';
import { Redirect } from 'react-router';
import axios from 'axios';
import TextInput from './TextInput';
import sessionstorage from 'sessionstorage';
import jwt from 'jsonwebtoken';

export default class Login extends Component {
  state = {
    username: '',
    password: '',
    redirect: false
  };

  generateToken() {
    let jwtToken = jwt.sign(
      { username: this.state.username },
      process.env.REACT_APP_SECRET_KEY,
      { expiresIn: 60 * 30 }
    );
    return jwtToken;
  }

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
    let jwtToken = self.generateToken();
    let payload = {
      username: self.state.username,
      password: self.state.password
    };
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };

    axios
      .post(apiBaseUrl + 'users/login/', payload, axiosConfig)
      .then(function(res) {
        if (res.status === 200) {
          sessionstorage.setItem('jwtToken', jwtToken);
          sessionstorage.setItem('username', self.state.username);
          self.setState({ redirect: true });
        }
      })
      .catch(function(err, res) {
        if (err.response.status === 403) {
          alert('Invalid username/password.');
        }
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
          <h1>Authentication</h1>
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
          <Button type="submit" color="primary" size="lg">
            Log In
          </Button>
        </Form>
      </Jumbotron>
    );
  }
}
