# HMR configuraiton

1. In `vite.config.ts` add a server section as follows. This allows it to serve the svgs itself rather than trying to get them from liferay.
	```
	server: {
		origin: 'http://localhost:5173'
	}
	```

1. In client-extension.yaml replace the urls section with
	```
    urls:
        - http://localhost:5173/@vite/client
        - http://localhost:5173/src/main.tsx
	```
1. Start liferay

1. Log in to liferay, access Site Settings -> Analytics and add the following code to the section for "Matomo":

	```
	<script type="module">
	import RefreshRuntime from 'http://localhost:5173/@react-refresh'
	RefreshRuntime.injectIntoGlobalHook(window)
	window.$RefreshReg$ = () => {}
	window.$RefreshSig$ = () => (type) => type
	window.__vite_plugin_react_preamble_installed__ = true
	</script>
	```
5. After liferay starts and the client extension deploys, start yarn dev