'use strict';

const uuid = require('node-uuid');

module.exports = {
	LMS_URL: process.env.LMS_URL || "http://imedaylight1.uat.d2ldev.com",
	TENANT_ID: process.env.TENANT_ID || "5fd775b8-b445-4baf-b75f-b295b6ae657b",
	AUTH_SERVICE: process.env.AUTH_SERVICE || "https://dev-auth.brightspace.com/core/",
	USERNAME: process.env.USERNAME || "d2luser",
	PASSWORD: process.env.PASSWORD || "password",
	COURSE_NAME: process.env.COURSE_NAME || "d2lcourse"
};
