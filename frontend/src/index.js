import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './components/Login';
import Register from './components/Register';
import registerServiceWorker from './registerServiceWorker';

const FourOhFour = () => <h1>404</h1>;

const MainApp = () => (
	<BrowserRouter>
		<Switch>
			<Route exact path="/" component={App} />
			<Route path="/login" component={Login} />
			<Route path="/register" component={Register} />
			<Route component={FourOhFour} />
		</Switch>
	</BrowserRouter>
);

ReactDOM.render(<MainApp />, document.getElementById('root'));
registerServiceWorker();
