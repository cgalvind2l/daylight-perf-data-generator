# Daylight Perf Data Generator

This is used for generating test data for measuring the performance of Daylight on the following pages: homepage w/ My Courses Widget, Discussions list, and Enter Grades. The data is generated through Valence API calls to an LMS.

This is copied from the [Pulse-test-data-generator project](https://github.com/Brightspace/Pulse-test-data-generator).

## Generating the Data
``` BASH
node app.js
```

### Configuration

Tests are configured using environment variables. Note that environment variables are all uppercase, while npm config variables are all lowercase. Defaults can be found in package.json under the config property.

* `LMS_URL` LMS url
* `TENANT_ID` Specify a tenant id to use when running LMS-less tests.
* `USERNAME` Username of your user that will receive the updates.
* `PASSWORD` Password of the user that will receive the updates.
* `AUTH_SERVICE` Url of the auth service to use

If using with a local LMS set appropriate config variable values for LMS_URL, TENANT_ID, BFS_URL and AUTH_SERVICE. Also run the following:

```BASH
$ export NODE_TLS_REJECT_UNAUTHORIZED=0
```

## Cleanup:

Cleanup needs to be done manually.
