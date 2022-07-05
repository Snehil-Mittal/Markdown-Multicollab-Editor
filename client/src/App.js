import { Router, Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './Components/Navbar.jsx';
import './App.css';
import WorkArea from './Components/WorkArea';
import { createBrowserHistory } from 'history';
import ErrorPage from './Components/Errorpage';
import Start from './Components/Start';

const history = createBrowserHistory();

export default function App() {
	return (
		<div className="App">
			<div className="shade">
				<Navbar />

				<h2 style={{color: "goldenrod"}}>Markdown Editor</h2>
				<Router history={history}>
					<Switch>
						<Route exact path="/" component={Start} />
						<Route path="/rooms/:id" component={WorkArea} />
						<Route path="/PageNotFound" component={ErrorPage} />
						<Redirect from="*" to="/PageNotFound" />
					</Switch>
				</Router>
			</div>
		</div>
	);
}
