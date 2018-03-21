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
    secret: process.env.REACT_APP_SECRET_KEY,
    redirect: false
  };

  generateToken() {
    console.log(`Generating....${this.state.secret}`);
    let jwtToken = jwt.sign(
      { username: this.state.username },
      this.state.secret,
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
      .post(apiBaseUrl + 'auth/login/', payload, axiosConfig)
      .then(function(res) {
        console.log(res);
        if (res.status === 200) {
          sessionstorage.setItem('jwtToken', jwtToken);
          self.setState({ redirect: true });
        } else if (res.status === 204) {
          console.log('Username password do not match');
          alert('username password do not match');
        } else {
          console.log('Username does not exists');
          alert('Username__ does not exist');
        }
      })
      .catch(function(err) {
        console.log('Username____wow does not exists');
        alert('Username does not exist');
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
