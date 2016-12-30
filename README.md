# Daylight Perf Data Generator

This is used for generating test data for measuring the performance of Daylight on the following pages: homepage w/ My Courses Widget, Discussions list, and Enter Grades. The data is generated through Valence API calls to an LMS.

This is copied from the [Pulse-test-data-generator project](https://github.com/Brightspace/Pulse-test-data-generator).

## Generating the Data
``` BASH
npm run generateData
```

### Configuration

Tests are configured using environment variables. Note that environment variables are all uppercase, while npm config variables are all lowercase. Defaults can be found in package.json under the config property.

* `LMS_URL` LMS url (http://imedaylight1.uat.d2ldev.com/)
* `TENANT_ID` Specify a tenant id (5fd775b8-b445-4baf-b75f-b295b6ae657b for above)
* `USERNAME` Username that will be used as the root for all usernames (default 'd2luser')
* `PASSWORD` Password of the instructor user (default 'd2lsupport')
* `COURSE_NAME` String that will be used as the root for all courses created (default 'd2lcourse')
* `AUTH_SERVICE` Url of the auth service to use (for the above UAT site, use https://dev-auth.brightspace.com/core/. for local LMS's, use https://auth-dev.proddev.d2l/core/)

If using with a local LMS set appropriate config variable values for LMS_URL, TENANT_ID, BFS_URL and AUTH_SERVICE. Also run the following:

```BASH
$ export NODE_TLS_REJECT_UNAUTHORIZED=0
```

## Cleanup:

Cleanup needs to be done manually.
