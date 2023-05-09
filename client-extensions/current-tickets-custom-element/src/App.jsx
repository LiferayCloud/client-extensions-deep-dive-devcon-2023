import {useState} from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';

function App() {
	const [count, setCount] = useState(0);
	const [rows, setRows] = useState([]);

	const columns = [
		{key: 'subject', name: 'Subject'},
		{key: 'ticketStatus', name: 'Status'},
		{key: 'description', name: 'Description'},
		{key: 'priority', name: 'Priority'},
		{key: 'type', name: 'Issue Type'},
		{key: 'supportRegion', name: 'Support Region'},
	];

	return (
		<section className="container current-tickets row">
			<div className="col-md-2">
				<nav className="h-100 site-navigation">
					<ul>
						<li>
							<a href="">Dashboards</a>
						</li>
						<li>
							<a href="">Projects</a>
						</li>
						<li>
							<a href="">Issues</a>
						</li>
					</ul>
				</nav>
			</div>
			<div className="col-md-10">
				<header className="align-items-center bg-light mb-3 p-3 row">
					<h1> Your Tickets</h1>
					<button className="btn btn-primary ml-auto">
						Create a New Ticket{' '}
					</button>
				</header>
				<main className="row p-0">
					<div className="col-md-10 m-0 p-0 pr-3">
						<DataGrid
							columns={columns}
							rows={rows}
							onRowsChange={setRows}
						/>
					</div>
					<nav className="col-md-2 ml-auto">
						<ul>
							<li>
								<a href="">My open issues</a>
							</li>
							<li>
								<a href="">Reported by me</a>
							</li>
							<li>
								<a href="">All issues</a>
							</li>
							<li>
								<a href="">Open issues</a>
							</li>
						</ul>
					</nav>
				</main>
			</div>
			<div class="col pr-0">
				<footer className="bg-light p-3 w-100 my-3">
					<div>Recent Activity</div>
				</footer>
			</div>
		</section>
	);
}

export default App;
