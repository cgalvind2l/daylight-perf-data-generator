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

function *cleanup() {
	console.log('cleaning up data created in this session...');
	yield testBench.users.cleanup();
}

function createCourses() {
  const templateAlias = 'Test Template';
  testBench.courses.createCourseTemplate(templateAlias)
    .then(function() {
      coursesLoop(1);
    }).catch(function(err) {
      console.log('something went wrong in creating the template: ' + err.body);
    });

    function coursesLoop(n) {
      console.log('making course ' + n);
      var courseAlias = config.COURSE_NAME + n;
      if(n === 51) {
        console.log('done! created courses');
        return;
      } else {
        testBench.courses.createCourse(courseAlias, templateAlias)
          .catch(function(err) {
            console.log('something went wrong');
          });
          coursesLoop(n+1);
      }
    }
}

function createStudents() {
	const userRoleId = 595;
	console.log('creating students...');
	function makeStudent(n) {
		console.log('making student ' + n);
		var userAlias = config.USERNAME + n,
			userData = {
				UserName: userAlias
			};
		if(n === 251){
			console.log('done! created students successfully');
			return;
		}
		else {
			testBench.users.createUser(userAlias, userRoleId, userData)
				.catch(function(err) {
					console.log('User ' + userAlias + ' already exists.');
				});
			makeStudent(n+1);
		}
	}
	makeStudent(1);
}

function myEval(cmd) {
	const args = cmd.trim().split(' ');

	co(function*() {
		switch(args[0]) {
      case 'createCourses':
        createCourses();
        break;
			case 'createStudents':
				createStudents();
				break;
			case 'cleanup':
				yield cleanup();
				break;
      case 'generateData':
        // first, create the courses
        // then, create the users; the students need to be enrolled in one course, teacher enrolled in all
        // then, create the discussion posts
			case 'help':
        console.log('help');
        break;
			default:
				console.log('I didn\'t recognize that command. Type \'help\' to see a list of commands');
		}
	}).catch(function(err) {
		console.log(err.stack);
	}).then(function() {
		replServer.displayPrompt();
	});
};
