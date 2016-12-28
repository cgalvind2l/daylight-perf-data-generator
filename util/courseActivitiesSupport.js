'use strict';

const config = require('../config'),
	login = require('./login'),
	openContent = require('./open-content'),
	testBench = require('@d2l/brightspace-test-bench'),
	uuid = require('node-uuid');

var content = [],
	grades = [],
	users = [];

const NUM_RETRIES = 5;

function createEnrollUser(userNum, courseAlias, userRoleId, userObject) {
	var userAlias = userObject && userObject.UserName || 'UserProgressUser' + uuid() + userNum;
	if (!userObject) {
		userObject = {
			UserName: userAlias
		};
	}

	return testBench.users.createUser(userAlias, userRoleId, userObject)
		.then(function() {
			return testBench.users.createUserPassword(userAlias, config.PASSWORD);
		})
		.then(function() {
			users.push(userAlias);
			return testBench.enrollments.enrollUserInCourse(userAlias, courseAlias, userRoleId);
		});
}

/*function createContent(contentNum, rootModuleAlias) {
	var contentAlias = 'link' + contentNum;
	return testBench.content.createLinkTopic(contentAlias, rootModuleAlias)
		.then(function() {
			content.push(contentAlias);
		});
}

function delay(time) {
	return new Promise(function(complete) {
		setTimeout(complete, time);
	});
}*/

function createGrade(gradeNum, courseAlias, tryNum) {
	const gradeAlias = 'A Simple Numeric Grade ' + gradeNum;
	const gradeItem = {
		MaxPoints: 10,
		CanExceedMaxPoints: false,
		IsBonus: false,
		ExcludeFromFinalGradeCalculation: false,
		GradeSchemeId: null,
		Name: gradeAlias,
		ShortName: '',
		GradeType: 'Numeric',
		CategoryId: null,
		Description: ''
	};

	if (tryNum < NUM_RETRIES) {
		return testBench.grades.createGradeObject(gradeItem, courseAlias)
			.then(function() {
				grades.push(gradeAlias);
			})
			.catch(function() {
				return delay(100)
					.then(createGrade(gradeNum, tryNum + 1));
			});
	} else {
		return Promise.reject('Failed to create grade');
	}
}

function gradeUser(userNum, gradeNum, tryNum) {
	const result = Math.floor(Math.random() * 11) + 1;
	if (tryNum < NUM_RETRIES) {
		return testBench.grades.gradeStudent(users[userNum], grades[gradeNum], result)
			.then(function() {
				return true;
			})
			.catch(function() {
				return delay(100)
					.then(gradeUser(userNum, gradeNum, tryNum + 1));
			});
	} else {
		return Promise.reject('Failed to grade user');
	}
}

function createDiscussionPost(userNum, postNum, topicAlias, tryNum, parentNum) {
	var postSubject = 'Discussion Post ' + users[userNum] + '' + postNum + '' + parentNum;
	var parentPostId = null;

	if (parentNum >= 0) {
		const discussions = testBench.discussions.getPosts();
		parentPostId = discussions[Object.keys(discussions)[parentNum]].PostId;
	}

	const postData = {
		ParentPostId: parentPostId,
		Subject: postSubject,
		Message: 'Nothing exciting here',
		IsAnonymous: false
	};

	if (tryNum < NUM_RETRIES) {
		return testBench.discussions.createPost(postData, topicAlias, userNum >= 0 && users[userNum])
			.catch(function() {
				return delay(100)
					.then(createDiscussionPost(userNum, postNum, topicAlias, tryNum + 1, parentNum));
			});
	} else {
		return Promise.reject('Failed to create discussion post');
	}
}

/*function loginUser(userNum) {
	return login(users[userNum], config.PASSWORD, config.LMS_URL);
}*/

/*function openUserContent(userNum, contentNum, courseAlias) {
	return openContent(users[userNum], config.PASSWORD, config.LMS_URL, courseAlias, content[contentNum]);
}*/

function setupCourse(templateAlias, courseAlias, rootModuleAlias, forumAlias, topicAlias) {
	return testBench.initialize(config.TENANT_ID, config.LMS_URL, config.AUTH_SERVICE)
		.then(function() {
			return testBench.courses.createCourseTemplate(templateAlias);
		})
		.then(function() {
			return testBench.courses.createCourse(courseAlias, templateAlias);
		})
		.then(function() {
			return testBench.content.createRootModule(rootModuleAlias, courseAlias);
		})
		.then(function() {
			const forumData = {
				Name: forumAlias,
				Description: '',
				StartDate: null,
				EndDate: null,
				PostStartDate: null,
				PostEndDate: null,
				AllowAnonymous: false,
				IsLocked: false,
				IsHidden: false,
				RequiresApproval: false
			};
			return testBench.discussions.createForum(forumData, courseAlias);
		})
		.then(function() {
			const topicData = {
				Name: topicAlias,
				Description: null,
				AllowAnonymousPosts: true,
				StartDate: null,
				EndDate: null,
				IsHidden: false,
				UnlockStartDate: null,
				UnlockEndDate: null,
				RequiresApproval: false,
				ScoreOutOf: null,
				IsAutoScore: false,
				IncludeNonScoredValues: false,
				ScoringType: null,
				IsLocked: false,
				MustPostToParticipate: false,
				RatingType: null
			};
			return testBench.discussions.createTopic(topicData, forumAlias, courseAlias);
		});
}

module.exports = {
	createEnrollUser: createEnrollUser,
	createContent: createContent,
	createGrade: createGrade,
	gradeUser: gradeUser,
	createDiscussionPost: createDiscussionPost,
	loginUser: loginUser,
	openUserContent: openUserContent,
	setupCourse: setupCourse
};
