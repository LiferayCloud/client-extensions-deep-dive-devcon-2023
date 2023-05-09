import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'

class WebComponent extends HTMLElement {
	connectedCallback() {
		ReactDOM.render(
			<React.StrictMode>
				<App route={this.getAttribute('route') || '/'} />
			</React.StrictMode>,
			this
		);
	}
}
const ELEMENT_ID = 'current-tickets-custom-element';

if (!customElements.get(ELEMENT_ID)) {
	customElements.define(ELEMENT_ID, WebComponent);
}
