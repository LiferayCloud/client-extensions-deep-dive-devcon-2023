import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import './index.css'

class WebComponent extends HTMLElement {
	connectedCallback() {
		// eslint-disable-next-line @liferay/portal/no-react-dom-render
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
