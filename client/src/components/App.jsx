import { BrowserRouter, Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import Header from './Header';
import Battle from '../pages/Battle';
import Home from '../pages/Home';
import Daily from '../pages/Daily';

import '../App.css';

function App() {

	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route
					path='/'
					element={<Home />}
				/>
				<Route
					path='/battle/:gameMode?/:gameIdFromLink?'
					element={<Battle />}
				/>
				<Route
					path='/daily/:wikiPage?'
					element={<Daily />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App
