import {useState} from 'react';
import {useMutation, useQuery} from 'react-query';
import './App.css';
import 'react-data-grid/lib/styles.css';
import axios from 'axios';
import DataGrid from 'react-data-grid';
import ClayAlert from '@clayui/alert';
import ClayIcon from '@clayui/icon';
import {ClayPaginationBarWithBasicItems} from '@clayui/pagination-bar';
import {
	fetchListTypeDefinitions,
	LIST_TICKET_PRIORITIES,
	LIST_TICKET_REGIONS,
	LIST_TICKET_RESOLUTIONS,
	LIST_TICKET_TYPES,
} from './listTypeEntries';
import RelativeTime from '@yaireo/relative-time';

const relativeTime = new RelativeTime();

let listTypeDefinitions = {};

const ticketSubjects = [
	'My object definition is not deploying in my batch client extension',
	'A theme CSS client extension is not showing on my search page',
	"I would like to change my site's icon through a client extension",
	'When updating a custom element React app, the URL metadata is not specified correctly',
	'Liferay is not triggering my Spring Boot app from an Object Action',
	'Client Extensions are amazing - how can I learn more?',
];

function getRandomElement(array) {
	return array[Math.floor(Math.random() * array.length)];
}

async function generateNewTicket() {
	if (!(LIST_TICKET_PRIORITIES in listTypeDefinitions)) {
		listTypeDefinitions = await fetchListTypeDefinitions();
	}
	const priorities = listTypeDefinitions[LIST_TICKET_PRIORITIES];
	const regions = listTypeDefinitions[LIST_TICKET_REGIONS];
	const resolutions = listTypeDefinitions[LIST_TICKET_RESOLUTIONS];
	const types = listTypeDefinitions[LIST_TICKET_TYPES];

	return axios.post(`/o/c/tickets?p_auth=${Liferay.authToken}`, {
		priority: {
			key: getRandomElement(priorities).key,
		},
		status: {
			code: 0,
		},
		resolution: {
			key: getRandomElement(resolutions).key,
		},
		subject: getRandomElement(ticketSubjects),
		supportRegion: {
			key: getRandomElement(regions).key,
		},
		ticketStatus: {
			key: 'open',
		},
		type: {
			key: getRandomElement(types).key,
		},
	});
}

const initialToastState = {
	content: null,
	show: false,
	type: null,
};

const initialFilterState = {
	field: '',
	value: '',
};

const filters = [
	{
		field: 'ticketStatus',
		value: 'open',
		text: 'Open issues',
	},
	{
		field: 'ticketStatus',
		value: 'queued',
		text: 'Queued issues',
	},
	{
		field: 'priority',
		value: 'major',
		text: 'Major Priority issues',
	},
	{
		field: 'resolution',
		value: 'unresolved',
		text: 'Unresolved issues',
	},
];

const fetchRecentTickets = async () => {
	const {data} = await axios.get(
		`/o/c/tickets?p_auth=${Liferay.authToken}&pageSize=3&page=1&sort=dateModified:desc`
	);
	return data;
};

function useRecentTickets() {
	const recentTickets = useQuery(['recentTickets'], fetchRecentTickets, {
		refetchInterval: 5000,
		refetchOnMount: false,
	});

	if (recentTickets.isSuccess) {
		return recentTickets.data?.items.map((ticket) => {
			let suggestions = [];
			try {
				suggestions = JSON.parse(ticket?.suggestions);
			} catch (error) {}

			return {
				dateCreated: new Date(ticket.dateCreated),
				dateModified: new Date(ticket.dateModified),
				description: ticket.description,
				id: ticket.id,
				priority: ticket.priority?.name,
				resolution: ticket.resolution?.name,
				subject: ticket.subject,
				supportRegion: ticket.supportRegion?.name,
				ticketStatus: ticket.ticketStatus?.name,
				type: ticket.type?.name,
				suggestions,
			};
		});
	}
	return [];
}

const fetchTickets = async ({queryKey}) => {
	const [, {page, pageSize, filter, search}] = queryKey;
	const filterSnippet =
		filter && filter.field && filter.value
			? encodeURI(`&filter=${filter.field} eq '${filter.value}'`)
			: '';
	const searchSnippet = search ? encodeURI(`&search=${search}`) : '';
	const {data} = await axios.get(
		`/o/c/tickets?p_auth=${Liferay.authToken}&pageSize=${pageSize}&sort=dateModified:desc&page=${page}${filterSnippet}${searchSnippet}`
	);
	return data;
};

/* Return ticket data from a closure. using React state was leading to too many rerenders
   or flickering of ui components */
const useTickets = (() => {
	let ticketData = {rows: [], totalCount: 0};

	const useTicketsInner = (page, pageSize, filter, search) => {
		const tickets = useQuery(
			['tickets', {page, pageSize, filter, search}],
			fetchTickets,
			{refetchInterval: 5000, refetchOnMount: false}
		);

		if (tickets.isSuccess) {
			ticketData = {
				totalCount: tickets?.data?.totalCount,
				rows: tickets?.data?.items?.map((ticket) => {
					let suggestions = [];
					try {
						suggestions = JSON.parse(ticket?.suggestions);
					} catch (error) {}
					return {
						priority: ticket.priority?.name,
						description: ticket.description,
						resolution: ticket.resolution?.name,
						id: ticket.id,
						subject: ticket.subject,
						supportRegion: ticket.supportRegion?.name,
						ticketStatus: ticket.ticketStatus?.name,
						type: ticket.type?.name,
						suggestions,
					};
				}),
			};
		}
		return ticketData;
	};
	return useTicketsInner;
})();

function App({queryClient}) {
	const [filter, setFilter] = useState(initialFilterState);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);
	const [search, setSearch] = useState();
	const [toastMessage, setToastMessage] = useState(initialToastState);

	const tickets = useTickets(page, pageSize, filter, search);

	const mutation = useMutation({
		mutationFn: generateNewTicket,
		onSuccess: () => {
			queryClient.invalidateQueries();
			setToastMessage({
				content: 'A new ticket was added!',
				show: true,
				type: 'success',
			});
		},
	});
	const recentTickets = useRecentTickets();

	const columns = [
		{
			key: 'subject',
			name: 'Subject',
			resizable: true,
			width: '45%',
			formatter: ({row}) => (
				<span>
					{row.suggestions && row.suggestions.length > 0 && (
						<ClayIcon
							className="mr-1"
							spritemap={Liferay.Icons.spritemap}
							symbol="link"
						/>
					)}
					{row.subject}
				</span>
			),
		},
		{key: 'resolution', name: 'Resolution', resizable: true, width: '15%'},
		{
			key: 'ticketStatus',
			name: 'Status',
			resizable: true,
			width: '15%',
			formatter: ({row}) => (
				<span>
					{row.ticketStatus === 'Queued' && (
						<ClayIcon
							className="mr-1"
							spritemap={Liferay.Icons.spritemap}
							symbol="bolt"
						/>
					)}
					{row.ticketStatus}
				</span>
			),
		},
		{key: 'priority', name: 'Priority', resizable: true, width: '10%'},
		{key: 'type', name: 'Type', resizable: true, width: '10%'},
		{key: 'supportRegion', name: 'Region', resizable: true, width: '10%'},
	];

	return (
		<section className="container current-tickets m-0 p-0 row">
			<div className="col-md-2">
				<nav className="h-100 site-navigation">
					<h6 className="text-uppercase">Site</h6>
					<ul>
						<li>
							<a href="/">Dashboards</a>
						</li>
						<li>
							<a href="/">Projects</a>
						</li>
						<li>
							<a href="/">Issues</a>
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
							mutation.mutate();

							event.preventDefault();
						}}
					>
						Generate a New Ticket
					</button>
				</header>
				<main className="row p-0">
					<div className="col-md-10 m-0 p-0 pr-3">
						<input
							className="form-control mb-3 w-100"
							placeholder="Search Tickets"
							type="text"
							onChange={(event) => {
								setSearch(event.target.value);
								setPage(1);
							}}
						></input>

						<DataGrid
							columns={columns}
							rows={tickets.rows}
							rowKeyGetter={(row) => row.id}
						/>
						<div className="my-3">
							<ClayPaginationBarWithBasicItems
								active={page}
								activeDelta={pageSize}
								ellipsisBuffer={3}
								ellipsisProps={{
									'aria-label': 'More',
									'title': 'More',
								}}
								onDeltaChange={(pageSize) => {
									setPageSize(pageSize);
								}}
								onActiveChange={(page) => {
									setPage(page);
								}}
								spritemap={Liferay.Icons.spritemap}
								totalItems={tickets.totalCount}
							/>
						</div>
					</div>
					<nav className="col-md-2 ml-auto">
						<h6 className="text-uppercase">Filters</h6>
						<ul>
							{filters.map((thisFilter, index) => (
								<li key={index}>
									<a
										className={
											filter === thisFilter
												? 'font-weight-bold'
												: ''
										}
										href="/"
										onClick={(event) => {
											if (filter === thisFilter) {
												setFilter(initialFilterState);
												setPage(1);
											} else {
												setFilter(thisFilter);
												setPage(1);
											}
											event.preventDefault();
										}}
									>
										{thisFilter.text}
									</a>
								</li>
							))}
						</ul>
					</nav>
				</main>
			</div>
			<div className="col pr-0">
				<footer className="bg-light p-3 w-100 my-3">
					<h2>Recent Activity</h2>
					<ul>
						{recentTickets.length > 0 &&
							recentTickets.map((recentTicket, index) => (
								<li className="pb-2" key={index}>
									Ticket #{recentTicket.id} (
									<em>{recentTicket.subject}</em>) was updated
									with status "{recentTicket.ticketStatus}"
									for support region{' '}
									{recentTicket.supportRegion}{' '}
									{relativeTime.from(
										recentTicket.dateCreated
									)}
									.
									{recentTicket.suggestions &&
										recentTicket.suggestions.length > 0 && (
											<div className="m-2 p-2">
												<em>Update:</em> Here are some
												suggestions for resources re:
												this ticket:&nbsp;
												{recentTicket.suggestions.map(
													(suggestion, index) => (
														<span key={index}>
															<a
																key={index}
																href={
																	suggestion.assetURL
																}
																rel="noreferrer"
																target="_blank"
															>
																{
																	suggestion.text
																}
															</a>
															,&nbsp;
														</span>
													)
												)}
											</div>
										)}
								</li>
							))}
						{recentTickets.length === 0 && (
							<>
								<li>
									Ticket #1234 closed with status "Resolved"
									by administrator
								</li>
								<li>
									Ticket #4566 closed with status "Won't fix"
									by administrator
								</li>
							</>
						)}
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
