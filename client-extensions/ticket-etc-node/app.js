'use strict';

import bodyParser from 'body-parser';
import config from './util/configTreePath.js';
import express from 'express';
import {
	corsWithReady,
	liferayJWT,
} from './util/liferay-oauth2-resource-server.js';
import log from './util/log.js';

log.info(`config: ${JSON.stringify(config, null, '\t')}`);

const app = express();

app.use(bodyParser.json());
app.use(corsWithReady);
app.use(liferayJWT);

app.get(config.readyPath, (req, res) => {
	res.send('READY');
});

app.post('/ticket/object/action/1', async (req, res) => {
	log.info('User %s is authorized', req.jwt.username);
	log.info('User scopes: ' + req.jwt.scope);

	const json = req.body;
	log.info(`/ticket/object/action/1: json: ${JSON.stringify(json, null, '\t')}`);
	res.status(200).send(json);
});

app.post('/ticket/object/action/2', async (req, res) => {
	log.info('User %s is authorized', req.jwt.username);
	log.info('User scopes: ' + req.jwt.scope);

	const json = req.body;
	log.info(`/ticket/object/action/2: json: ${JSON.stringify(json, null, '\t')}`);
	res.status(200).send(json);
});

const serverPort = config['server.port'];

app.listen(serverPort, () => {
	log.info('App listening on %s', serverPort);
});

export default app;
