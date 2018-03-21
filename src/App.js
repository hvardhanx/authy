import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Alert, Button, Jumbotron, Form } from 'reactstrap';
import sessionstorage from 'sessionstorage';
// this.getUserName();
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      secret: '&00&xl=%!b(%)n080i2qt5epr(qise)70^9cd626%4e&$6nl^g',
      first_name: ''
    };
  }
  // self.props.location.state.username

  componentDidMount() {
    const isLoggedIn = sessionstorage.getItem('jwtToken') ? true : false;
    if (isLoggedIn) {
      this.getUserName();
    }
  }

  getUserName() {
    let apiBaseUrl = 'http://localhost:8000/api/';
    let self = this;
    let jwtToken = sessionstorage.getItem('jwtToken');
    console.log('JWT: ' + jwtToken);
    let payload = {};
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer ' + jwtToken
      }
    };

    console.log(axiosConfig);

    axios({
      method: 'get',
      url: apiBaseUrl + 'user/' + self.props.location.state.username + '/',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer ' + jwtToken
      }
    })
      // .get(apiBaseUrl + 'user/' + self.props.location.state.username + '/', payload, axiosConfig)
      .then(function(res) {
        console.log(res);
        if (res.status === 200) {
          console.log(res.data[0].first_name);
          self.setState({ first_name: res.data[0].first_name });
        } else if (res.status === 204) {
          console.log('Username password do not match');
          alert('username password do not match');
        } else {
          console.log('Username does not exists');
          alert('Username__ does not exist');
        }
      })
      .catch(function(err) {
        console.log('Token expired');
        alert('Token expired please logout and then login again :/');
      });
  }

  onSubmit = event => {
    event.preventDefault();
    let apiBaseUrl = 'http://localhost:8000/api/';
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
        console.log(res);
        if (res.status === 200) {
          sessionstorage.removeItem('jwtToken');
          self.setState({ isLoggedIn: false });
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
      <h1 className="App-title">Hello? - Bonsoir, {getUser}.</h1>
    ) : (
      <h1 className="App-title">Please login.</h1>
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
