import {useEffect, useState} from 'react';
import './App.css';
import 'react-data-grid/lib/styles.css';
import axios from 'axios';
import DataGrid from 'react-data-grid';
import {LoremIpsum} from 'lorem-ipsum';
import ClayAlert  from '@clayui/alert';
import {
	fetchListTypeDefinitions,
	LIST_TICKET_PRIORITIES,
	LIST_TICKET_REGIONS,
	LIST_TICKET_STATUSES,
	LIST_TICKET_RESOLUTIONS,
	LIST_TICKET_TYPES,
} from './listTypeEntries';

const lorem = new LoremIpsum();

const listTypeDefinitions = await fetchListTypeDefinitions();

const priorities = listTypeDefinitions[LIST_TICKET_PRIORITIES];
const statuses = listTypeDefinitions[LIST_TICKET_STATUSES];
const regions = listTypeDefinitions[LIST_TICKET_REGIONS];
const resolutions = listTypeDefinitions[LIST_TICKET_RESOLUTIONS];
const types = listTypeDefinitions[LIST_TICKET_TYPES];

function getRandomElement(array) {
	return array[Math.floor(Math.random() * array.length)].key;
}

async function addTestRow() {
	await axios.post(`/o/c/tickets?p_auth=${Liferay.authToken}`, {
		priority: {
			key: getRandomElement(priorities),
		},
		status: {
			code: 0,
		},
		resolution: {
			key: getRandomElement(resolutions),
		},
		subject: lorem.generateWords(8),
		supportRegion: {
			key: getRandomElement(regions),
		},
		ticketStatus: {
			key: getRandomElement(statuses),
		},
		type: {
			key: getRandomElement(types),
		},
	});
}

const initialToastState = {
	content: null,
	show: false,
	type: null,
};


const PAGE_SIZE = 20;
function App() {
	const [rows, setRows] = useState([]);
	const [page, setPage] = useState(1);
	const [toastMessage, setToastMessage] = useState(initialToastState);

	async function fetchTickets() {
		const {data} = await axios.get(
			`/o/c/tickets?p_auth=${Liferay.authToken}&pageSize=${PAGE_SIZE}&page=${page}`
		);

		setRows(
			data?.items.map((row) => ({
				priority: row.priority?.name,
				resolution: row.resolution?.name,
				subject: row.subject,
				supportRegion: row.supportRegion?.name,
				ticketStatus: row.ticketStatus?.name,
				type: row.type?.name,
			}))
		);
	}

	useEffect(() => {
		fetchTickets();
	}, []);

	const columns = [
		{key: 'subject', name: 'Subject', width: '45%'},
		{key: 'resolution', name: 'Resolution', width: '15%'},
		{key: 'ticketStatus', name: 'Status', width: '10%'},
		{key: 'priority', name: 'Priority', width: '10%'},
		{key: 'type', name: 'Type', width: '10%'},
		{key: 'supportRegion', name: 'Region', width: '10%'},
	];

	return (
		<section className="container current-tickets m-0 p-0 row">
			<div className="col-md-2">
				<nav className="h-100 site-navigation">
					<h6 className="text-uppercase">Site</h6>
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
					<button
						className="btn btn-primary ml-auto"
						onClick={(event) => {
							addTestRow();

							setToastMessage({
								content: "A new ticket was added!",
								show: true,
								type:"success"
							})
							event.preventDefault();
						}}
					>
						Create a New Ticket
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
						<h6 className="text-uppercase">Filters</h6>
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
			<div className="col pr-0">
				<footer className="bg-light p-3 w-100 my-3">
					<h2>Recent Activity</h2>
					<ul>
						<li>
							Ticket #1234 closed with status "Resolved" by
							administrator
						</li>
						<li>
							Ticket #4566 closed with status "Won't fix" by
							administrator
						</li>
					</ul>
				</footer>
			</div>
			{toastMessage.show && (
				<ClayAlert.ToastContainer>
					<ClayAlert
						autoClose={3000}
						displayType={toastMessage.type}
						onClose={() => setToastMessage(initialToastState)}
						spritemap={Liferay.Icons.spritemap}
							>
						{toastMessage.content}
					</ClayAlert>
				</ClayAlert.ToastContainer>
			)}
		</section>
	);
}

export default App;
