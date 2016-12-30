'use strict';
const co = require('co'),
repl = require('repl'),
testBench = require('@d2l/brightspace-test-bench'),
config = require('./config');

const replServer = repl.start({
	eval: myEval
});

function cleanup() {
	console.log('cleaning up data created in this session...');
	return testBench.users.cleanup()
	.then(function() {
		testBench.courses.cleanup()
		.catch(function(err) {
			console.log('something went wrong cleaning up courses: ' + err);
		});
	}).catch(function(err) {
		console.log('something went wrong cleaning up users: ' + err);
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
		if (n === 51) {
			return Promise.resolve();
		} else {
			return testBench.courses.createCourse(courseAlias, templateAlias)
			.then(function() {
				return coursesLoop(n + 1);
			}).catch(function(err) {
				console.log('something went wrong creating a course: ' + err);
			});
		}
	}
}

function createDiscussions() {
	const courseAlias = 'd2lcourse1'; //this is the course that everyone is enrolled in

	console.log('creating discussion forums, topics, and posts...');
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
		if (n === 7) {
			return Promise.resolve();
		} else {
			return testBench.discussions.createForum(forumData, courseAlias)
			.then(function() {
				return topicLoop(1, forumData.Name)
				.then(function() {
					return forumLoop(n + 1);
				});
			}).catch(function(err) {
				console.log('something went wrong creating a discussion forum: ' + err);
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
		if (n === 7) {
			return Promise.resolve();
		} else {
			return testBench.discussions.createTopic(topicData, forumName)
			.then(function() {
				return postLoop(1, topicData.Name)
				.then(function() {
					return topicLoop(n + 1, forumName);
				});
			}).catch(function(err) {
				console.log('something went wrong creating a disucssion topic: ' + err);
			});
		}
	}

	function postLoop(n, topicName) {
		const postData = {
			ParentPostId: null,
			Subject: topicName + 'Post' + n,
			Message: '<p><img src=\"https://s.brightspace.com/course-images/images/143b0716-e467-46f3-8dd3-99df1443c1c7/banner-wide-high-density-max-size.jpg\"/></p>',
			IsAnonymous: false
		},
		userPosting = config.USERNAME + n;
		if (n === 7) {
			return Promise.resolve();
		} else {
			return testBench.discussions.createPost(postData, topicName, userPosting)
			.then(function() {
				return postLoop(n + 1, topicName);
			}).catch(function(err) {
				console.log('something went wrong creating a discussion post: ' + err);
			});
		}
	}
}

function createGrades() {
	const courseAlias = config.COURSE_NAME + '1';
	const categoryAlias = 'gradecategory';
	const objectAlias = categoryAlias + ' gradeobject';
	const gradeCategory = {
		Name: categoryAlias,
		ShortName: categoryAlias,
		CanExceedMax: false,
		ExcludeFromFinalGrade: false,
		StartDate: null,
		EndDate: null,
		Weight: 0.25,
		MaxPoints: null,
		AutoPoints: null,
		WeightDistributionType: null,
		NumberOfHighestToDrop: null,
		NumberOfLowestToDrop: null
	};

	console.log('creating a grade category and object...');
	return testBench.grades.createGradeCategory(gradeCategory, courseAlias)
	.then(function(response) {
		const gradeObject = {
			MaxPoints: 100,
			CanExceedMaxPoints: false,
			IsBonus: false,
			ExcludeFromFinalGradeCalculation: false,
			GradeSchemeId: null,
			Name: objectAlias,
			ShortName: objectAlias,
			GradeType: 'Numeric',
			CategoryId: response.Id,
			Description: 'none',
			AssociatedTool: null
		};
		return testBench.grades.createGradeObject(gradeObject, courseAlias)
		.catch(function(err) {
			console.log('something went wrong creating a grade object: ' + err);
		});
	}).catch(function(err) {
		console.log('something went wrong creating a grade cateogry: ' + err);
	});
}

function createStudents() {
	const userRoleId = 595,
	courseAlias = config.COURSE_NAME + '1',
	gradeAlias = 'gradecategory gradeobject';
	console.log('creating, enrolling, and grading students...');
	return makeStudent(1);

	function makeStudent(n) {
		var userAlias = config.USERNAME + n,
		userData = {
			UserName: userAlias
		};

		if (n === 251) {
			return Promise.resolve();
		} else {
			return testBench.users.createUser(userAlias, userRoleId, userData)
			.then(function() {
				return testBench.users.createUserImage(userAlias, 'profile.png', './resources/profile.png')
				.then(function() {
					return testBench.enrollments.enrollUserInCourse(userAlias, courseAlias, userRoleId)
					.then(function() {
						return testBench.grades.gradeStudent(userAlias, gradeAlias, 5)
						.then(function() {
							return makeStudent(n + 1);
						}).catch(function(err) {
							console.log('something went wrong grading a student: ' + err);
						});
					}).catch(function(err) {
						console.log('something went wrong with enrolling' + err);
					});
				}).catch(function(err) {
					console.log('something went wrong uploading a profile image: ' + err);
				});
			}).catch(function(err) {
				console.log('something went wrong creating a user: ' + err);
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
		return testBench.users.createUserPassword(userAlias, 'd2lsupport')
		.then(function() {
			enrollLoop(1);
		}).catch(function(err) {
			console.log('something went wrong creating the teacher\'s password: ' + err);
		});
	}).catch(function(err) {
		console.log('something went wrong creating the teacher: ' + err);
	});

	function enrollLoop(n) {
		var courseAlias = config.COURSE_NAME + n;
		if (n === 51) {
			return Promise.resolve();
		}
		return testBench.enrollments.enrollUserInCourse(userAlias, courseAlias, userRoleId)
		.then(function() {
			return testBench.enrollments.pinCourse(userAlias, courseAlias)
			.then(function() {
				return enrollLoop(n + 1);
			}).catch(function(err) {
				console.log('something went wrong with pinning a course: ' + err);
			});
		}).catch(function(err) {
			console.log('something went wrong with an enrollment: ' + err);
		});
	}
}

function myEval(cmd) {
	const args = cmd.trim().split(' ');

	co(function*() {
		yield testBench.initialize(config.TENANT_ID, config.LMS_URL, config.AUTH_SERVICE)
		.then(function() {
			switch (args[0]) {
				case 'createCourses':
				return createCourses();
				break;
				case 'createStudents':
				return createStudents();
				break;
				case 'createTeacher':
				return createTeacher();
				break;
				case 'cleanup':
				return cleanup();
				break;
				case 'createDiscussions':
				return createDiscussions();
				break;
				case 'generateData':
				return createCourses()
				.then(function() {
					return createGrades()
					.then(function() {
						return createStudents()
						.then(function() {
							return createTeacher()
							.then(function() {
								return createDiscussions();
							});
						});
					});
				});
				break;
				default:
				console.log('I didn\'t recognize that command.');
			}
		});
	}).catch(function(err) {
		console.log(err.stack);
	}).then(function() {
		replServer.displayPrompt();
	});
};
