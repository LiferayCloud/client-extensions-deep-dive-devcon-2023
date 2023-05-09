import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';

class WebComponent extends HTMLElement {
	connectedCallback() {
		const root = createRoot(this);
		root.render(
			<React.StrictMode>
				<App route={this.getAttribute('route') || '/'} />
			</React.StrictMode>
		);
	}
}
const ELEMENT_ID = 'current-tickets-custom-element';

if (!customElements.get(ELEMENT_ID)) {
	customElements.define(ELEMENT_ID, WebComponent);
}
