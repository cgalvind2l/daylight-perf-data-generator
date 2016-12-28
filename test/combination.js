'use strict';

const bfs = require('../../util/bfs'),
	config = require('../../config'),
	testBench = require('@d2l/brightspace-test-bench');

const templateAlias = 'PulseTemplate',
	courseAlias = 'Pulse Course',
	userAlias = config.USERNAME,
	userData = {
		UserName: config.USERNAME
	},
	otherUserAlias = 'OtherUser',
	linkAlias = 'link',
	rootModuleAlias = 'rootModule',
	userRoleId = 595;

describe('Test', function() {
	describe('combinations', function() {
		before(() => {
			return testBench.initialize(config.TENANT_ID, config.LMS_URL, config.AUTH_SERVICE)
				.then(function() {
					return testBench.users.createUser(userAlias, userRoleId, userData);
				})
				.then(function() {
					return testBench.users.createUserPassword(userAlias, config.PASSWORD);
				})
				.then(function() {
					return testBench.users.getTokenForCreatedUser(userAlias);
				})
				.then(function(token) {
					return bfs.ensureDevice(token);
				})
				.then(function() {
					return testBench.users.createUser(otherUserAlias, userRoleId);
				})
				.then(function() {
					return testBench.courses.createCourseTemplate(templateAlias);
				});
		});

		describe('in Pulse Course', function() {
			let topicAliasSubscribed;

			before(function() {
				let forumAlias;
				return testBench.courses.createCourse(courseAlias, templateAlias)
					.then(function() {
						return testBench.enrollments.enrollUserInCourse(userAlias, courseAlias, userRoleId);
					})
					.then(function() {
						return testBench.enrollments.enrollUserInCourse(otherUserAlias, courseAlias, userRoleId);
					})
					.then(function() {
						const forumData = {
							Name: 'My Forum',
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
						forumAlias = forumData.Name;

						return testBench.discussions.createForum(forumData, courseAlias);
					})
					.then(function() {
						const topicDataSubscribed = {
							Name: 'Subscribed Topic',
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
						topicAliasSubscribed = topicDataSubscribed.Name;

						return testBench.discussions.createTopic(topicDataSubscribed, forumAlias, courseAlias);
					});
			});

			it('wait for you to subscribe to topic(s)', function(done) {
				setTimeout(done, 30000);
			});

			it('user should receive news, content added, grade, and discussion updates', function() {
				const newsBody = {
					'text': null,
					'html': '<p>hello world</p>'
				};

				const postData_simple = {
					ParentPostId: null,
					Subject: 'Simple discussion post - should not create notification',
					Message: 'Nothing exciting here - should not create notification',
					IsAnonymous: false
				};

				const gradeItem = {
					MaxPoints: 10,
					CanExceedMaxPoints: false,
					IsBonus: false,
					ExcludeFromFinalGradeCalculation: false,
					GradeSchemeId: null,
					Name: 'A Simple Numeric Grade',
					ShortName: '',
					GradeType: 'Numeric',
					CategoryId: null,
					Description: ''
				};
				const gradeAlias = gradeItem.Name;

				return testBench.courses.createNews('News Item 1', newsBody, courseAlias)
					.then(function() {
						return testBench.content.createRootModule(rootModuleAlias, courseAlias);
					})
					.then(function() {
						return testBench.content.createLinkTopic(linkAlias, rootModuleAlias);
					})
					.then(function() {
						return testBench.grades.createGradeObject(gradeItem, courseAlias);
					})
					.then(function() {
						return testBench.grades.gradeStudent(userAlias, gradeAlias, 7);
					})
					.then(function() {
						return testBench.discussions.createPost(postData_simple, topicAliasSubscribed, otherUserAlias);
					});

			});
		});
	});
});
