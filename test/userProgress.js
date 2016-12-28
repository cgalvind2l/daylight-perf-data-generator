'use strict';

const support = require('../util/courseActivitiesSupport');
const exportData = require('./export-data');
const Chance = require('chance');

const templateAlias = 'UserProgressTestCourseTemplate',
	courseAlias = 'UserProgressTestCourse',
	rootModuleAlias = 'rootModule',
	forumAlias = 'My Forum',
	topicAlias = 'My Topic',
	userRoleId = 595;

const NUM_CONTENT = 4,
	NUM_GRADES = 10,
	NUM_USERS = 4;

var chance = new Chance();

const users = [
	{
		NUM_GRADED_ITEMS: NUM_GRADES,
		NUM_DISC_POSTS: 100,
		NUM_DISC_REPLIES: 0,
		USER_NUM: 0
	},
	{
		NUM_GRADED_ITEMS: NUM_GRADES / 2,
		NUM_DISC_POSTS: 10,
		NUM_DISC_REPLIES: 100,
		USER_NUM: 1
	},
	{
		NUM_GRADED_ITEMS: 0,
		NUM_DISC_POSTS: 0,
		NUM_DISC_REPLIES: 10,
		USER_NUM: 2
	},
	{
		NUM_GRADED_ITEMS: 1,
		NUM_DISC_POSTS: 5,
		NUM_DISC_REPLIES: 5,
		USER_NUM: 3
	}
];

function userGeneralScenario(userObj) {

	console.log('Creating "User Progress" test data for user ' + userObj.USER_NUM);

	var promises = [];

	for (var i = 0; i < userObj.NUM_GRADED_ITEMS; i++) {
		promises.push(support.gradeUser(userObj.USER_NUM, i, 0));
	}

	for (i = 0; i < userObj.NUM_DISC_POSTS; i++) {
		promises.push(support.createDiscussionPost(userObj.USER_NUM, i, topicAlias, 0));
	}

	for (i = 0; i < userObj.NUM_DISC_REPLIES; i++) {
		promises.push(support.createDiscussionPost(userObj.USER_NUM, i, topicAlias, 0, 0));
	}

	return Promise.all(promises);
}

function user1Scenario(USER_NUM) {
	/**** User 1:
	Logins: 2 // their logins would happen during their content reading
	Content Read: 50%
	Grades: 5
	Threads: 10
	Replies: 100 *****/

	return support.openUserContent(USER_NUM, 0, courseAlias)
		.then(function() {
			return support.openUserContent(USER_NUM, 1, courseAlias);
		});
}

function user2Scenario(USER_NUM) {
	/**** User 2:
	Logins: 10
	Content Read: 100%
	Grades: 0
	Threads: 0
	Replies: 10 *****/

	return support.openUserContent(USER_NUM, 0, courseAlias)
		.then(function() {
			return support.openUserContent(USER_NUM, 1, courseAlias);
		})
		.then(function() {
			return support.openUserContent(USER_NUM, 2, courseAlias);
		})
		.then(function() {
			return support.openUserContent(USER_NUM, 3, courseAlias);
		})
		.then(function() {
			return support.loginUser(USER_NUM);
		})
		.then(function() {
			return support.loginUser(USER_NUM);
		})
		.then(function() {
			return support.loginUser(USER_NUM);
		})
		.then(function() {
			return support.loginUser(USER_NUM);
		})
		.then(function() {
			return support.loginUser(USER_NUM);
		})
		.then(function() {
			return support.loginUser(USER_NUM);
		});

}

function user3Scenario(USER_NUM) {
	/**** User 3:
	Logins: 5
	Content Read: 25%
	Grades: 1
	Threads: 5
	Replies: 5 *****/

	return support.loginUser(USER_NUM)
		.then(function() {
			return support.loginUser(USER_NUM);
		})
		.then(function() {
			return support.loginUser(USER_NUM);
		})
		.then(function() {
			return support.loginUser(USER_NUM);
		})
		.then(function() {
			return support.openUserContent(USER_NUM, 0, courseAlias);
		});
}

function setupScenarios() {
	const promises = [];
	for (var i = 0; i < NUM_USERS; i++) {
		const rand = Math.floor(Math.random() * (100000 - 10000) + 10000);
		var userObj = {
			FirstName: chance.first(),
			LastName: chance.last(),
			UserName: `uxd-${rand}`,
			OrgDefinedId: rand
		};
		promises.push(support.createEnrollUser(i, courseAlias, userRoleId, userObj));
	}

	for (i = 0; i < NUM_CONTENT; i++) {
		promises.push(support.createContent(i, rootModuleAlias));
	}

	for (i = 0; i < NUM_GRADES; i++) {
		promises.push(support.createGrade(i, courseAlias, 0));
	}

	promises.push(support.createDiscussionPost(null, 1, topicAlias, 0)); // create a discussion post by d2lsupport for users to reply to

	return Promise.all(promises);
}

function runScenarios() {
	return support.setupCourse(templateAlias, courseAlias, rootModuleAlias, forumAlias, topicAlias)
		.then(function() {
			return setupScenarios();
		})
		.then(function() {
			return userGeneralScenario(users[0]);
		})
		.then(function() {
			return userGeneralScenario(users[1]);
		})
		.then(function() {
			return user1Scenario(1);
		})
		.then(function() {
			return userGeneralScenario(users[2]);
		})
		.then(function() {
			return user2Scenario(2);
		})
		.then(function() {
			return userGeneralScenario(users[3]);
		})
		.then(function() {
			return user3Scenario(3);
		})
		.then(function() {
			console.log('------------------------------------------------');
			console.log('Successfully generated "User Progress" test data');
			exportData();
		});
}

module.exports = runScenarios();
