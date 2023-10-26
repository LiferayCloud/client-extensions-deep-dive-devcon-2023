var script = document.createElement('script');
script.type = 'module';

script.textContent =
	"import RefreshRuntime from 'http://localhost:5173/@react-refresh'; " +
	'RefreshRuntime.injectIntoGlobalHook(window); ' +
	'window.$RefreshReg$ = () => {}; ' +
	'window.$RefreshSig$ = () => (type) => type; ' +
	'window.__vite_plugin_react_preamble_installed__ = true; ';

document.head.appendChild(script);
