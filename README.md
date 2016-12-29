# Daylight Perf Data Generator

This is used for generating test data for measuring the performance of Daylight on the following pages: homepage w/ My Courses Widget, Discussions list, and Enter Grades. The data is generated through Valence API calls to an LMS.

This is copied from the [Pulse-test-data-generator project](https://github.com/Brightspace/Pulse-test-data-generator).

## Currently Supports:

- Discussions:
  - Subscribed and not subscribed to topics
  - Subscribed and not subscribed to threads
  - Languages (English, Chinese, Cryillic, Hindi)
  - Post length
  - Post subject length
  - Poster Name (language and length)
  - Single long words requiring wrapping
  - Reply to post and reply to reply
  - Many discussion posts (commented out)
- Discussions-Load:
  - A thread of replies to replies of arbitrary length
- News
  - Languages (English, Chinese)
- Combination
  - Grade, discussion, news, and content link (note that notifications are not currently sent for content link added)
- User Progress
  - Scenarios that create content and view it, login user, create grades and grade user, and have users create discussion posts and replies

## Generating the Data
``` BASH
node app.js
>
```

Available commands:

`cleanup`: cleanup any students created during this session. if session is exited, students must be deleted manually

`createStudents`: creates 250 students in the LMS

`.exit`: exit

### Configuration

Tests are configured using environment variables. Note that environment variables are all uppercase, while npm config variables are all lowercase. Defaults can be found in package.json under the config property.

* `LMS_URL` LMS url
* `TENANT_ID` Specify a tenant id to use when running LMS-less tests.
* `USERNAME` Username of your user that will receive the updates.
* `PASSWORD` Password of the user that will receive the updates.
* `DEVICE_TOKEN` Device token to use when creating a device to receive feed items
* `DEVICE_PLATFORM` Device platform to use when creating a device to receive feed items
* `BFS_URL` BFS url
* `LOAD_LIMIT` The number of replies that will be added to a discussion thread for load testing

For example:
```BASH
export LMS_URL='https://pltest.uat.d2ldev.com'
export USERNAME='PulseUser'
export PASSWORD='d2l'

node app.js
>
```

If using with a local LMS set appropriate config variable values for LMS_URL, TENANT_ID, BFS_URL and AUTH_SERVICE. Also run the following:

```BASH
$ export NODE_TLS_REJECT_UNAUTHORIZED=0
```

## Cleanup:

Currently cleanup needs to be done manually. This is because otherwise the tester would be unable to login as the user, be unable to see the course, and other users would no longer have a username.

Once completed testing, clean the following (making sure not to clean anyone else's data):
- Course(s) - Default is 'Pulse Course'
- Course Template(s) - Default begins with 'testBenchTemplate'
- User(s) - Default username begins with 'E2ETest'
