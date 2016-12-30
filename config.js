'use strict';

const uuid = require('node-uuid');

module.exports = {
	LMS_URL: process.env.LMS_URL || "http://kd82-cgalvin:44444",
	TENANT_ID: process.env.TENANT_ID || "ec63dd64-de40-489c-a63f-b1295d8a277f",
	AUTH_SERVICE: process.env.AUTH_SERVICE || "https://auth-dev.proddev.d2l/core/",
	USERNAME: process.env.USERNAME || "d2luser",
	PASSWORD: process.env.PASSWORD || "password",
	COURSE_NAME: process.env.COURSE_NAME || "d2lcourse"
};
