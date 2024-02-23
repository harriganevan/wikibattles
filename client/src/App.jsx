import { useState } from 'react';
import { useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

//maybe can remove connect - io('http://localhost:3000')
const socket = io.connect('http://localhost:3000');

function App() {

	const [links, setLinks] = useState([]);
	const [search, setSearch] = useState('');
	const [timerId, setTimerId] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [currentPage, setCurrentPage] = useState('');

	const getStartingLink = async () => {
		const response = await fetch('http://localhost:3000/links/');
		const startingLinks = await response.json();
		setLinks(startingLinks.links);
		setCurrentPage(startingLinks.currentTitle);
	}

	useEffect(() => {

		socket.on('receive_titles', (data) => {
			setLinks(data.links);
			setCurrentPage(data.title);
		});

		getStartingLink();

	}, [socket]);

	const getNewLinks = async (link) => {
		const response = await fetch(`http://localhost:3000/links/${link}`, {
			method: 'POST',
		});
	}

	const delayedFunction = async (value) => {
		if (value) {
			console.log('delayed search:', value);
			const response = await fetch(`https://en.wikipedia.org/w/rest.php/v1/search/title?q=${value}&limit=10`);
			const searchResults = await response.json();
			setSearchResults(searchResults.pages);
		}
	}

	const handleChange = (e) => {
		clearTimeout(timerId);
		setSearch(e.target.value);
		console.log(search);
		setTimerId(setTimeout(() => delayedFunction(e.target.value), 500));
	}

	return (
		<>
			<h1>WikiBattles</h1>
			<h2>current page: {decodeURI(currentPage)}</h2>
			<input onChange={handleChange} value={search} />
			<div>
				{searchResults.map(result =>
					<button>{result.key.replaceAll('_', ' ')}</button>
				)}
			</div>
			<div className='buttons'>
				{links.map(link =>
					<button onClick={() => getNewLinks(link)}>{decodeURI(link)}</button>
				)}
			</div>
		</>
	)
}

export default App
