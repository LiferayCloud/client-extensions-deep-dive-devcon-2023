import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import {QueryClient, QueryClientProvider} from 'react-query';

const queryClient = new QueryClient();
class WebComponent extends HTMLElement {
	connectedCallback() {
		const root = createRoot(this);
		root.render(
			<React.StrictMode>
				<QueryClientProvider client={queryClient}>
					<App queryClient={queryClient} route={this.getAttribute('route') || '/'} />
				</QueryClientProvider>
			</React.StrictMode>
		);
	}
}
const ELEMENT_ID = 'current-tickets-custom-element';

if (!customElements.get(ELEMENT_ID)) {
	customElements.define(ELEMENT_ID, WebComponent);
}
