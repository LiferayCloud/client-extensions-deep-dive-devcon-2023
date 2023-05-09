# HMR Configuration

1. In `vite.config.ts` add a server section as follows.
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

1. Start Liferay

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

1. After Liferay starts and the client extension deploys, start `yarn dev`

Now you should be able to edit source code and the React app will update in Liferay immediately.