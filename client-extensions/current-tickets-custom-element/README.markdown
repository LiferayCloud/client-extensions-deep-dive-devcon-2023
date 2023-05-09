# HMR Configuration

1. Start Liferay

1. Deploy this client extension using `blade gw deployDev`

1. Log in to Liferay, access Site Settings -> Analytics and add the following code to the section for "Matomo":

	```
	<script type="module">
	import RefreshRuntime from 'http://localhost:5173/@react-refresh'
	RefreshRuntime.injectIntoGlobalHook(window)
	window.$RefreshReg$ = () => {}
	window.$RefreshSig$ = () => (type) => type
	window.__vite_plugin_react_preamble_installed__ = true
	</script>
	```

1. Run `yarn dev` to start the vite dev server

Now you should be able to edit source code and the React app will update in Liferay immediately.