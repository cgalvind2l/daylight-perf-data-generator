'use strict';

const request = require('superagent');
const parsers = require('superagent').parse;
const assert = require('better-assert');
const co = require('co');

function parser(req) {
	/* eslint no-invalid-this:0 */
	if (!req.headers.hasOwnProperty('content-type') || /json(;|$)/.test(req.headers['content-type'])) {
		return parsers['application/json'].apply(this, arguments);
	} else {
		return parsers.text.apply(this, arguments);
	}
}

function flattenEntity(entity) {
	assert('object' === typeof entity);

	const actions = {};
	if (entity.actions) {
		entity.actions.forEach(function(action) {
			actions[action.name] = action;
		});
	}

	const links = {};
	if (entity.links) {
		entity.links.forEach(function(link) {
			link.rel.forEach(function(rel) {
				links[rel] = link;
			});
		});
	}
	return {
		actions: actions,
		links: links
	};
}

const sirenFetch = co.wrap(function* sirenFetch(entity, jwt, headers) {
	assert('string' === typeof jwt);

	let href;
	if ('string' === typeof entity) {
		href = entity;
	} else if (entity.href) {
		href = entity.href;
	} else {
		const links = flattenEntity(entity).links;
		assert('object' === typeof links.self);
		href = links.self.href;
	}

	assert('string' === typeof href);
	let res = request
		.get(href)
		.parse(parser)
		.set('Accept', 'application/vnd.siren+json')
		.set('Authorization', `Bearer ${jwt}`)
		.set(headers || {});
	res = yield res;
	return res.body;
});

const sirenAction = co.wrap(function* sirenAction(entity, actionName, jwt, data, headers) {
	if ('string' === typeof entity) {
		entity = yield sirenFetch(entity, jwt);
	}
	assert('object' === typeof entity);
	assert('string' === typeof actionName);
	assert('string' === typeof jwt);
	assert('object' === typeof data || undefined === data);

	const flattened = flattenEntity(entity);
	const action = flattened.actions[actionName];

	assert('object' === typeof action);
	assert('string' === typeof action.href);
	assert('string' === typeof action.method);

	const href = action.href;
	const method = action.method.toLowerCase();
	const fields = data || {};
	if (action.fields) {
		action.fields.forEach(function(field) {
			if (!fields.hasOwnProperty(field.name)) {
				fields[field.name] = field.value;
			}
		});
	}
	let res = request(method, href)
		.parse(parser)
		.set('Accept', 'application/vnd.siren+json')
		.set('Authorization', `Bearer ${jwt}`)
		.set(headers || {})
		.send(fields);

	res = yield res;

	if (!/json$/.test(res.type) && res.headers.location) {
		res = yield request.get(res.headers.location)
			.parse(parser)
			.set('Accept', 'application/vnd.siren+json')
			.set('Authorization', `Bearer ${jwt}`)
			.set(headers || {});
	}
	return res.body;
});

module.exports = {
	flatten: flattenEntity,
	action: sirenAction,
	fetch: sirenFetch
};
