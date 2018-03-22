import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Button, Form } from 'reactstrap';
import sessionstorage from 'sessionstorage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      secret: process.env.REACT_APP_SECRET_KEY,
      first_name: ''
    };
  }

  componentDidMount() {
    const isLoggedIn = sessionstorage.getItem('jwtToken') ? true : false;
    if (isLoggedIn) {
      this.getUserName();
    }
  }

  getUserName() {
    let apiBaseUrl = process.env.REACT_APP_API;
    let self = this;
    let jwtToken = sessionstorage.getItem('jwtToken');
    let username = sessionstorage.getItem('username');
    axios({
      method: 'post',
      url: apiBaseUrl + 'user/' + username + '/',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer ' + jwtToken
      }
    })
      .then(function(res) {
        if (res.status === 200) {
          self.setState({ first_name: res.data.first_name });
        }
      })
      .catch(function(err) {
        alert('Token error! Login again. :/');
        sessionstorage.removeItem('jwtToken');
        sessionstorage.removeItem('username');
        self.setState({ isLoggedIn: false });
      });
  }

  onSubmit = event => {
    event.preventDefault();
    let apiBaseUrl = process.env.REACT_APP_API;
    let self = this;
    let payload = {};
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };

    axios
      .get(apiBaseUrl + 'auth/logout/', payload, axiosConfig)
      .then(function(res) {
        if (res.status === 200) {
          sessionstorage.removeItem('jwtToken');
          sessionstorage.removeItem('username');
          self.setState({ isLoggedIn: false });
        }
      })
      .catch(function(err) {
        alert('Server error. Please try again! :/');
      });
  };

  render() {
    const isLoggedIn = sessionstorage.getItem('jwtToken') ? true : false;
    const name = this.state.first_name;
    let getUser;
    if (isLoggedIn) {
      getUser = name;
    }
    const button = isLoggedIn ? (
      <Button type="submit" color="primary" size="lg">
        Log out
      </Button>
    ) : (
      <div>
        <a href="/login">Login</a> | <a href="/register">Register</a>
      </div>
    );
    const heading = isLoggedIn ? (
      <h1 className="App-title">Hello, {getUser}.</h1>
    ) : (
      <h1 className="App-title">Please login/register.</h1>
    );
    return (
      <div className="App">
        <header className="App-header">{heading}</header>
        <Form onSubmit={this.onSubmit}>{button}</Form>
      </div>
    );
  }
}

export default App;
