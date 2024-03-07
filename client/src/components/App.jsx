import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Battle from '../pages/Battle';
import Home from '../pages/Home';
import Daily from './Daily';

import '../App.css';

function App() {

	return (
		<BrowserRouter>
			<Routes>
				<Route
					path='/'
					element={<Home />}
				/>
				<Route
					path='/battle/:gameIdFromLink?'
					element={<Battle />}
				/>
				<Route
					path='/daily'
					element={<Daily />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App