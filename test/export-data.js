'use strict';

const
	config = require('../config'),
	dust = require('dustjs-linkedin'),
	fs = require('fs'),
	testBench = require('@d2l/brightspace-test-bench');

const exportTemplate = fs.readFileSync(config.EXPORT_TEMPLATE, 'utf8');
const compiled = dust.compile(exportTemplate, 'export');
dust.loadSource(compiled);

function exportData() {
	const context = {
		iter: function(chunk, context, bodies, params) {
			const obj = params['for'] || context.current();
			const keyName = params['key'] || 'key';
			const valueName = params['value'] || 'value';
			let limit = +params['limit'] || 0;

			for (const k in obj) {
				chunk = chunk.render(bodies.block, context.push({[keyName]: k, [valueName]: obj[k]}));
				if (--limit === 0) {
					break;
				}
			}
			return chunk;
		},

		config: config,

		users: testBench.users.getUsers(),
		groups: testBench.groups.getGroups(),
		groupCategories: testBench.groups.getGroupCategories(),
		modules: testBench.content.getModules(),
		links: testBench.content.getLinks(),
		calendar: testBench.calendar.getCalendarEvents(),
		gradeObjects: testBench.grades.getGradeObjects(),
		gradeCategories: testBench.grades.getGradeCategories(),
		forums: testBench.discussions.getForums(),
		topics: testBench.discussions.getTopics(),
		posts: testBench.discussions.getPosts(),
		templates: testBench.courses.getCourseTemplates(),
		courses: testBench.courses.getCourses(),
		news: testBench.courses.getNews(),
		folders: testBench.dropbox.getCreatedDropboxFolders(),
		quizzes: testBench.quizzing.getQuizzes(),
		questions: testBench.quizzing.getQuestions()
	};

	return new Promise(function(resolve, reject) {
		dust.render('export', context, function(err, out) {
			if (!err) {
				fs.writeFileSync(config.EXPORT_TEMPLATE.replace(/\.dust$/, ''), out, 'utf8');
				resolve();
			} else {
				reject(err);
			}
		});
	});
}

module.exports = exportData;
