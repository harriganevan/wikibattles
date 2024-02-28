import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Battle from '../pages/Battle';
import Home from '../pages/Home';

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
					path='/battle/:gameId?'
					element={<Battle />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App
