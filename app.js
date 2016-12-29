'use strict';
const co = require('co'),
repl = require('repl'),
testBench = require('@d2l/brightspace-test-bench'),
config = require('./config');

const replServer = repl.start({
	prompt: '> ',
	eval: myEval
});

testBench.initialize(config.TENANT_ID, config.LMS_URL, config.AUTH_SERVICE);

function cleanup() {
	console.log('cleaning up data created in this session...');
	return testBench.users.cleanup()
		.then(function() {
			testBench.courses.cleanup();
		});
}

function createCourses() {
	const templateAlias = 'Test Template';
	console.log('creating template...');

	return testBench.courses.createCourseTemplate(templateAlias)
		.then(function() {
			console.log('creating courses...');
			return coursesLoop(1);
		}).catch(function(err) {
			console.log('something went wrong in creating the template: ' + err);
		});

	function coursesLoop(n) {
		var courseAlias = config.COURSE_NAME + n;
		if(n === 51) {
			console.log('done! created courses');
			return Promise.resolve();
		} else {
			return testBench.courses.createCourse(courseAlias, templateAlias)
				.then(function() {
					return coursesLoop(n+1);
				}).catch(function(err) {
					console.log('something went wrong');
				});
		}
	}
}

function createDiscussions() {
	const courseAlias = 'd2lcourse1'; //this is the course that everyone is enrolled in

	return forumLoop(1);

	function forumLoop(n) {
		var forumData = {
			Name: 'Forum' + n,
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
		if(n === 7) {
			console.log('done! created discussions');
			return Promise.resolve();
		} else {
			return testBench.discussions.createForum(forumData, courseAlias)
				.then(function() {
					console.log('creating topics for ' + forumData.Name + '...');
					return topicLoop(1, forumData.Name)
						.then(function() {
							return forumLoop(n+1);
						});
				}).catch(function(err) {
					console.log('something went wrong: ' + err);
				});
		}
	}

	function topicLoop(n, forumName) {
		var topicData = {
			Name: forumName + 'Topic' + n,
			Description: null,
			AllowAnonymousPosts: false,
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
		if(n === 7) {
			console.log('done! created topics for ' + forumName);
			return Promise.resolve();
		} else {
			return testBench.discussions.createTopic(topicData, forumName)
				.then(function() {
					console.log('creating posts for ' + topicData.Name + '...');
					return postLoop(1, topicData.Name)
						.then(function() {
							return topicLoop(n + 1, forumName);
						});
				}).catch(function(err) {
					console.log('something went wrong: ' + err);
				});
		}
	}

	function postLoop(n, topicName) {
		const postData = {
			ParentPostId: null,
			Subject: topicName + 'Post' + n,
			Message: 'Nothing exciting here',
			IsAnonymous: false
		},
			userPosting = config.USERNAME + n;
		if(n === 7) {
			console.log('done! created posts for ' + topicName);
			return Promise.resolve();
		} else {
			return testBench.discussions.createPost(postData, topicName, userPosting)
				.then(function() {
					return postLoop(n + 1, topicName);
				}).catch(function(err) {
					console.log('something went wrong: ' + err);
				});
		}
	}
}

function createStudents() {
	const userRoleId = 595,
	courseAlias = config.COURSE_NAME + '1';
	console.log('creating and enrolling students...');
	return makeStudent(1);

	function makeStudent(n) {
		var userAlias = config.USERNAME + n,
		userData = {
			UserName: userAlias
		};

		if(n === 251){
			console.log('done! created students successfully');
			return Promise.resolve();
		} else {
			return testBench.users.createUser(userAlias, userRoleId, userData)
				.then(function() {
					return testBench.enrollments.enrollUserInCourse(userAlias, courseAlias, userRoleId)
						.then(function() {
							return makeStudent(n+1);
						}).catch(function(err) {
							console.log('something went wrong with enrolling\n' + err);
						});
				}).catch(function(err) {
					console.log('something went wrong: ' + err);
				});
		}
	}
}

function createTeacher() {
	const userRoleId = 596,
		userAlias = 'd2lteacher',
		userData = {
			UserName: userAlias
		};
	console.log('creating teacher...');
	return testBench.users.createUser(userAlias, userRoleId, userData)
		.then(function() {
			console.log('finished creating the teacher, now enrolling...');
			return enrollLoop(1);
		}).catch(function(err) {
			console.log('something went wrong creating the teacher: ' + err);
		});

	function enrollLoop(n) {
		var courseAlias = config.COURSE_NAME + n;
		if(n === 51) {
			console.log('finished enrolling teacher in courses');
			return;
		}
		return testBench.enrollments.enrollUserInCourse(userAlias, courseAlias, userRoleId)
			.then(function() {
				return enrollLoop(n+1);
			}).catch(function(err) {
				console.log('something went wrong with an enrollment: ' + err);
			});
	}
}

function myEval(cmd) {
	const args = cmd.trim().split(' ');

	co(function*() {
		switch(args[0]) {
			case 'createCourses':
				yield createCourses();
				break;
			case 'createStudents':
				yield createStudents();
				break;
			case 'createTeacher':
				yield createTeacher();
				break;
			case 'cleanup':
				yield cleanup();
				break;
			case 'generateData':
				yield createCourses()
					.then(function() {
						return createStudents()
							.then(function() {
								return createTeacher()
									.then(function() {
										return createDiscussions();
									});
							});
						});

				// then, create the discussion posts
				break;
			default:
				console.log('I didn\'t recognize that command.');
		}
	}).catch(function(err) {
		console.log(err.stack);
	}).then(function() {
		replServer.displayPrompt();
	});
};
