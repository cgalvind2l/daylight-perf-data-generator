'use strict';

const
	config = require('../config'),
	testBench = require('@d2l/brightspace-test-bench');

const templateAlias = 'PulseTemplate',
	userAlias = config.USERNAME,
	userData = {
		UserName: config.USERNAME
	},
	otherUserAlias = 'OtherUser',
	userRoleId = 595;

console.log('USERNAME: ' + userAlias);
console.log('PASSWORD: ' + config.PASSWORD);

describe('Test', function() {
	describe('discussions', function() {
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
				.then(function() {
					return testBench.users.createUser(otherUserAlias, userRoleId);
				})
				.then(function() {
					return testBench.courses.createCourseTemplate(templateAlias);
				});
		});

		describe('in a course with a long Chinese name', function() {
			const courseAliasChinese = '急載続確受戦税紙路告基鈴合敵。織海士璧毎無北府画元米辞船連。前掲真済記生周水開決掲載有参。軽望跡記刊話少岩年数段影。';
			let topicAliasSubscribed_Chinese;

			before(function() {
				let forumAlias_Chinese;
				return testBench.courses.createCourse(courseAliasChinese, templateAlias)
					.then(function() {
						return testBench.enrollments.enrollUserInCourse(userAlias, courseAliasChinese, userRoleId);
					})
					.then(function() {
						return testBench.enrollments.enrollUserInCourse(otherUserAlias, courseAliasChinese, userRoleId);
					})
					.then(function() {
						const forumData = {
							Name: 'My Forum in Chinese Course',
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
						forumAlias_Chinese = forumData.Name;

						return testBench.discussions.createForum(forumData, courseAliasChinese);
					})
					.then(function() {
						const topicDataSubscribed = {
							Name: 'Subscribed Topic in Chinese course',
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
						topicAliasSubscribed_Chinese = topicDataSubscribed.Name;

						return testBench.discussions.createTopic(topicDataSubscribed, forumAlias_Chinese, courseAliasChinese);
					});
			});

			it('wait for you to subscribe to topic(s)', function(done) {
				setTimeout(done, 30000);
			});

			describe('in a SUBSCRIBED TOPIC, should receive notification of', function() {
				it('a simple discussion post', function() {
					const postData_simple = {
						ParentPostId: null,
						Subject: 'A Simple discussion post in Chinese course',
						Message: 'Nothing exciting here',
						IsAnonymous: false
					};
					return testBench.discussions.createPost(postData_simple, topicAliasSubscribed_Chinese, otherUserAlias);
				});

				it('a Chinese discussion post', function() {
					const postData_Chinese = {
						ParentPostId: null,
						Subject: '横氷意無際達薄算気美属色帯育 横氷意無際達薄算気美属色帯育。市金蓄機事任青作風最激不和木写開行表図。催中泉覧類断競稔仕壊込矢裁文推。必吉子先最岡中頑投込取由暮新事剤笠描。受費在候離比村翼正表語途医速。和題行速雅能経韓処死強三戒報。無森錦境援最遺阜問並川来族高新巻報投田。周止岐健東暫権挙社失整死全境担千江。購促凝施目逃惑件割幼速必撃技大速獄全社。 答語抗開所記着階宮撃伊曲。発援町季征月奏造映教表多。斬情示読始護通録今体血問無達線最成構利中。体執政棋史化風関情辺思文辺業化。携若長院意拒土用賠頁確年。与日紙先地番一童約市真定堂技',
						Message: '横氷意無際達薄算気美属色帯育。市金蓄機事任青作風最激不和木写開行表図。催中泉覧類断競稔仕壊込矢裁文推。必吉子先最岡中頑投込取由暮新事剤笠描。受費在候離比村翼正表語途医速。和題行速雅能経韓処死強三戒報。無森錦境援最遺阜問並川来族高新巻報投田。周止岐健東暫権挙社失整死全境担千江。購促凝施目逃惑件割幼速必撃技大速獄全社。 答語抗開所記着階宮撃伊曲。発援町季征月奏造映教表多。斬情示読始護通録今体血問無達線最成構利中。体執政棋史化風関情辺思文辺業化。携若長院意拒土用賠頁確年。与日紙先地番一童約市真定堂技横氷意無際達薄算気美属色帯育。市金蓄機事任青作風最激不和木写開行表図。催中泉覧類断競稔仕壊込矢裁文推。必吉子先最岡中頑投込取由暮新事剤笠描。受費在候離比村翼正表語途医速。和題行速雅能経韓処死強三戒報。無森錦境援最遺阜問並川来族高新巻報投田。周止岐健東暫権挙社失整死全境担千江。購促凝施目逃惑件割幼速必撃技大速獄全社。 答語抗開所記着階宮撃伊曲。発援町季征月奏造映教表多。斬情示読始護通録今体血問無達線最成構利中。体執政棋史化風関情辺思文辺業化。携若長院意拒土用賠頁確年。与日紙先地番一童約市真定堂技',
						IsAnonymous: false
					};
					return testBench.discussions.createPost(postData_Chinese, topicAliasSubscribed_Chinese, otherUserAlias);
				});
			});

			describe('in an SUBSCRIBED thread, should receive notification of', function() {
				let postId;

				before(function() {
					const postData_simple = {
						ParentPostId: null,
						Subject: 'Simple discussion post that will have replies in Chinese course',
						Message: 'Nothing exciting here',
						IsAnonymous: false
					};

					return testBench.discussions.createPost(postData_simple, topicAliasSubscribed_Chinese, otherUserAlias)
						.then(function(body) {
							postId = body.PostId;
						});
				});

				it('a simple reply', function() {
					const postDataReply_simple = {
						ParentPostId: postId,
						Subject: 'A Simple discussion reply in Chinese course - reply 1',
						Message: 'I am a simple reply',
						IsAnonymous: false
					};
					return testBench.discussions.createPost(postDataReply_simple, topicAliasSubscribed_Chinese, otherUserAlias);
				});
			});
		});

		describe('in Pulse Course', function() {
			const courseAlias = 'Pulse Course';
			let topicAliasSubscribed,
				topicAliasUnsubscribed;

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
						topicAliasSubscribed = topicDataSubscribed.Name;

						return testBench.discussions.createTopic(topicDataSubscribed, forumAlias, courseAlias);
					})
					.then(function() {
						const topicDataUnsubscribed = {
							Name: 'Unsubscribed Topic',
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
						topicAliasUnsubscribed = topicDataUnsubscribed.Name;

						return testBench.discussions.createTopic(topicDataUnsubscribed, forumAlias, courseAlias);
					});
			});

			it('wait for you to subscribe to topic(s)', function(done) {
				setTimeout(done, 30000);
			});

			describe('in an NOT SUBSCRIBED TO TOPIC, should not receive notification of', function() {

				it('a simple discussion post', function() {
					const postData_simple = {
						ParentPostId: null,
						Subject: 'Simple discussion post - should not create notification',
						Message: 'Nothing exciting here - should not create notification',
						IsAnonymous: false
					};
					return testBench.discussions.createPost(postData_simple, topicAliasUnsubscribed, otherUserAlias);
				});
			});

			describe('in an NOT SUBSCRIBED TO THREAD, should not receive notification of', function() {
				let postId;

				beforeEach(function() {
					const postData_simple = {
						ParentPostId: null,
						Subject: 'Simple discussion post with reply - should not create notification',
						Message: 'Nothing exciting here - should not create notification',
						IsAnonymous: false
					};
					return testBench.discussions.createPost(postData_simple, topicAliasUnsubscribed, otherUserAlias)
						.then(function(body) {
							postId = body.PostId;
						});
				});

				it('a simple discussion post reply', function() {
					const postData_simpleReply = {
						ParentPostId: postId,
						Subject: 'Simple discussion post reply - should not create notification',
						Message: 'Nothing exciting',
						IsAnonymous: false
					};

					return testBench.discussions.createPost(postData_simpleReply, topicAliasUnsubscribed, otherUserAlias);
				});
			});

			describe('in a SUBSCRIBED TOPIC, should receive notification of', function() {

				it('a simple discussion post', function() {
					const postData_simple = {
						ParentPostId: null,
						Subject: 'A Simple discussion post',
						Message: 'Nothing exciting here',
						IsAnonymous: false
					};
					return testBench.discussions.createPost(postData_simple, topicAliasSubscribed, otherUserAlias);
				});

				it('when a user with a long name posts', function() {
					const postData_simple = {
						ParentPostId: null,
						Subject: 'A Simple discussion post from a user with a long name',
						Message: 'Nothing exciting here',
						IsAnonymous: false
					};

					const userData = {
						FirstName: 'LoremipsumdolorsitametignotautroquemeaexNovumaffertseanoIddoaase',
						LastName: 'LoremipsumdolorsitametignotautroquemeaexNovumaffetametignotaa',
						MiddleName: ''
					};
					const userLongNameAlias = 'UserWithLongName';

					return testBench.users.createUser(userLongNameAlias, userRoleId, userData)
						.then(function() {
							return testBench.enrollments.enrollUserInCourse(userLongNameAlias, courseAlias, userRoleId);
						})
						.then(function() {
							return testBench.discussions.createPost(postData_simple, topicAliasSubscribed, userLongNameAlias);
						});
				});

				it('when a user with a Hindi name posts', function() {
					const postData_simple = {
						ParentPostId: null,
						Subject: 'A Simple discussion post from a user with a Hindi name',
						Message: 'Nothing exciting here',
						IsAnonymous: false
					};

					const userData = {
						FirstName: 'हुएआदिबिन्दुओप्रोत्साहितविशेषकिकेसकताहुआआदीप्रतिबध',
						LastName: 'हुएआदिबिन्दुओप्रोत्साहितविशेषकिकेसकताहुआआदीप्रतिबध',
						MiddleName: ''
					};
					const userHindiNameAlias = 'UserWithHindiName';

					return testBench.users.createUser(userHindiNameAlias, userRoleId, userData)
						.then(function() {
							return testBench.enrollments.enrollUserInCourse(userHindiNameAlias, courseAlias, userRoleId);
						})
						.then(function() {
							return testBench.discussions.createPost(postData_simple, topicAliasSubscribed, userHindiNameAlias);
						});
				});

				// skip because IsAnonymous does not currently work
				it.skip('when an anonymous user posts', function() {
					const postData_simple = {
						ParentPostId: null,
						Subject: 'A Simple discussion post from an anonymous user',
						Message: 'Nothing exciting here',
						IsAnonymous: true
					};

					return testBench.discussions.createPost(postData_simple, topicAliasSubscribed, otherUserAlias);
				});

				// commented out to not run 100 discussion posts unless needed
				/*function manyPosts(postNum) {
					it('a hundred simple discussion posts', function() {
						const postData_simple = {
							ParentPostId: null,
							Subject: `A Simple discussion post Number ${ postNum }`,
							Message: 'Nothing exciting here',
							IsAnonymous: false
						};
						return testBench.discussions.createPost(postData_simple, topicAliasSubscribed, otherUserAlias);
					});
				}

				for(var i = 0; i < 100; i++) {
					manyPosts(i);
				} */

				it('a discussion post with a single long word requiring wrapping', function() {
					const postData_simple = {
						ParentPostId: null,
						Subject: 'A discussion post containing a single long word',
						Message: 'LoremipsumdolorsitametiustonosterappetereadestnecnoerathendrerithasaeternoconsequatidNovimnobischorolobortisnusquamluptatummeleaInenimquaspriSumodiscereeoscuAnvelunumneglegenturPerporrolibrisutiustoindoctummaiestatishisexExmollispericulatemporibuseamNevidemagnasonetestprinatumprimaexplicariadAnnemoreelaboraretquonousuminimuminvenireteutamurcomplectiturmeaIdmeistemporsalutatusmelconsultinciduntnopriErosconsulatuhasnoanassentiorvoluptatumvixHiseazrileloquentiamnameinatumutroqueSeaintellegatabhorreantinSedsintnominaviatAdsiteuismodlaoreetAgaminviduntscripserithisetnoluisseaccusamusvulputateutcumNamidquedefinitionemneidquediceretinciderinteumelSimulviderereameaHisprimisluciliusrectequeinSeahabeoiriurepersecutiutDicoequidemplatonemusuidnopronostrumlegendosdignissimbrutemalorumutusuCuporroinviduntprograecedisceremeieatemeatotapartemdisputandoIriurecommunequaestioquieiQuividererinvenirehonestatisutnestatisut',
						IsAnonymous: false
					};
					return testBench.discussions.createPost(postData_simple, topicAliasSubscribed, otherUserAlias);
				});

				it('a discussion post with a really long name', function() {
					const postData_simple = {
						ParentPostId: null,
						Subject: 'LoremipsumdolorsitametiustonosterappetereadestnecnoerathendrerithasaeternoconsequatidNovimnobischorolobortisnusquamluptatummeleaInenimquaspriSumodiscereeoscuAnvelunumnegSumodiscereeoscuAnvelunumnegdestnecnoerathendrerithasadestnecnoerathendecnoerathenestatisutnestatisutnestatisuttiustonost',
						Message: 'The subject of this discussion posts was a really long word.',
						IsAnonymous: false
					};
					return testBench.discussions.createPost(postData_simple, topicAliasSubscribed, otherUserAlias);
				});

				it('a Chinese discussion post', function() {
					const postData_Chinese = {
						ParentPostId: null,
						Subject: '横氷意無際達薄算気美属色帯育。市金蓄機事任青作風最激不和木写開行表図。催中泉覧類断競稔仕壊込矢裁文推。必吉子先最岡中頑投込取由暮新事剤笠描。受費在候離比村翼正表語途医速。和題行速雅能経韓処死強三戒報。無森錦境援最遺阜問並川来族高新巻報投田。周止岐健東暫権挙社失整死全境担千江。購促凝施目逃惑件割幼速必撃技大速獄全社。 答語抗開所記着階宮撃伊曲。発援町季征月奏造映教表多。斬情示読始護通録今体血問無達線最成構利中。体執政棋史化風関情辺思文辺業化。携若長院意拒土用賠頁確年。与日紙先地番一童約市真定堂技',
						Message: '横氷意無際達薄算気美属色帯育。市金蓄機事任青作風最激不和木写開行表図。催中泉覧類断競稔仕壊込矢裁文推。必吉子先最岡中頑投込取由暮新事剤笠描。受費在候離比村翼正表語途医速。和題行速雅能経韓処死強三戒報。無森錦境援最遺阜問並川来族高新巻報投田。周止岐健東暫権挙社失整死全境担千江。購促凝施目逃惑件割幼速必撃技大速獄全社。 答語抗開所記着階宮撃伊曲。発援町季征月奏造映教表多。斬情示読始護通録今体血問無達線最成構利中。体執政棋史化風関情辺思文辺業化。携若長院意拒土用賠頁確年。与日紙先地番一童約市真定堂技横氷意無際達薄算気美属色帯育。市金蓄機事任青作風最激不和木写開行表図。催中泉覧類断競稔仕壊込矢裁文推。必吉子先最岡中頑投込取由暮新事剤笠描。受費在候離比村翼正表語途医速。和題行速雅能経韓処死強三戒報。無森錦境援最遺阜問並川来族高新巻報投田。周止岐健東暫権挙社失整死全境担千江。購促凝施目逃惑件割幼速必撃技大速獄全社。 答語抗開所記着階宮撃伊曲。発援町季征月奏造映教表多。斬情示読始護通録今体血問無達線最成構利中。体執政棋史化風関情辺思文辺業化。携若長院意拒土用賠頁確年。与日紙先地番一童約市真定堂技',
						IsAnonymous: false
					};
					return testBench.discussions.createPost(postData_Chinese, topicAliasSubscribed, otherUserAlias);
				});

				it('a Cryillic discussion post', function() {
					const postData_Cyrillic = {
						ParentPostId: null,
						Subject: 'Аугюэ бландит элььэефэнд ад про. Ед пэр эррэм модыратиюз, ку квюод кэтэро ёудёкабет квуй. Ельлюд ныкэжчятатябюз ан векж, нык ан праэчынт компльыктётюр витюпэраторебуз, эю ипзум ыкчпэтында еюж. Пауло молыжтйаы векж экз, ырант праэчынт хонэзтатёз нам ы',
						Message: 'Аугюэ бландит элььэефэнд ад про. Ед пэр эррэм модыратиюз, ку квюод кэтэро ёудёкабет квуй. Ельлюд ныкэжчятатябюз ан векж, нык ан праэчынт компльыктётюр витюпэраторебуз, эю ипзум ыкчпэтында еюж. Пауло молыжтйаы векж экз, ырант праэчынт хонэзтатёз нам ыАугюэ бландит элььэефэнд ад про. Ед пэр эррэм модыратиюз, ку квюод кэтэро ёудёкабет квуй. Ельлюд ныкэжчятатябюз ан векж, нык ан праэчынт компльыктётюр витюпэраторебуз, эю ипзум ыкчпэтында еюж. Пауло молыжтйаы векж экз, ырант праэчынт хонэзтатёз нам ыАугюэ бландит элььэефэнд ад про. Ед пэр эррэм модыратиюз, ку квюод кэтэро ёудёкабет квуй. Ельлюд ныкэжчятатябюз ан векж, нык ан праэчынт компльыктётюр витюпэраторебуз, эю ипзум ыкчпэтында еюж. Пауло молыжтйаы векж экз, ырант праэчынт хонэзтатёз нам ыАугюэ бландит элььэефэнд ад про. Ед пэр эррэм модыратиюз, ку квюод кэтэро ёудёкабет квуй. Ельлюд ныкэжчятатябюз ан векж, нык ан праэчынт компльыктётюр витюпэраторебуз, эю ипзум ыкчпэтында еюж. Пауло молыжтйаы векж экз, ырант праэчынт хонэзтатёз нам ы Аугюэ бландит элььэефэнд ад про. Ед пэр эррэм модыратиюз, ку квюод кэтэро ёудёкабет квуй. Ельлюд ныкэжчятатябюз ан векж, нык ан праэчынт компльыктётюр витюпэраторебуз, эю ипзум ыкчпэтында еюж. Пауло молыжтйаы векж экз, ырант праэчынт хонэзтатёз нам ыАугюэ бландит элььэефэнд ад про. Ед пэр эррэм модыратиюз, ку квюод кэтэро ёудёкабет квуй. Ельлюд ныкэжчятатябюз ан векж, нык ан праэчынт компльыктётюр витюпэраторебуз, эю ипзум ыкчпэтында еюж. Пауло молыжтйаы векж экз, ырант праэчынт хонэзтатёз нам ы',
						IsAnonymous: false
					};
					return testBench.discussions.createPost(postData_Cyrillic, topicAliasSubscribed, otherUserAlias);
				});
			});

			describe('in an SUBSCRIBED thread, should receive notification of', function() {
				let postId,
					replyPostId;

				before(function() {
					const postData_simple = {
						ParentPostId: null,
						Subject: 'Simple discussion post that will have replies',
						Message: 'Nothing exciting here',
						IsAnonymous: false
					};

					return testBench.discussions.createPost(postData_simple, topicAliasSubscribed, otherUserAlias)
						.then(function(body) {
							postId = body.PostId;
						});
				});

				it('a simple reply', function() {
					const postDataReply_simple = {
						ParentPostId: postId,
						Subject: 'A Simple discussion reply - reply 1',
						Message: 'I am a simple reply',
						IsAnonymous: false
					};
					return testBench.discussions.createPost(postDataReply_simple, topicAliasSubscribed, otherUserAlias)
						.then(function(body) {
							replyPostId = body.PostId;
						});
				});

				it('an Arabic reply message', function() {
					const postDataReply_Arabic = {
						ParentPostId: postId,
						Subject: 'An Arabic reply message - reply 2',
						Message: 'ثم أدنى بريطانيا-فرنسا لان. أمدها مليون الأولية وقد هو, دار الصين الحيلولة لم. إيو أن المجتمع الجديدة،, ذات عل وبعد المارق. أحدث تنفّس للجزر عدم في, بعض عل بسبب سياسة مشروط. الذود الشمال هذا ٣٠, بـ حول التي التخطيط والفلبين. وفنلندا وبريطانيا و وفي. ألمّ العدّ بـ بال. ممثّلة ولكسمبورغ فصل ما, هذا ممثّلة وحلفاؤها الإمتعاض بـ, الا هو تجهيز محاولات ليتسنّى. اعلان وتزويده لم تحت, إحكام بقيادة ٣٠ حتى, دنو مع بقعة الأرضية.',
						IsAnonymous: false
					};
					return testBench.discussions.createPost(postDataReply_Arabic, topicAliasSubscribed, otherUserAlias);
				});

				it('a simple reply to a reply', function() {
					const postDataReply_simpleReply = {
						ParentPostId: replyPostId,
						Subject: 'A Simple discussion reply to a reply - reply 3',
						Message: 'I am a simple reply to a reply',
						IsAnonymous: false
					};
					return testBench.discussions.createPost(postDataReply_simpleReply, topicAliasSubscribed, otherUserAlias);
				});
			});
		});

	});
});
