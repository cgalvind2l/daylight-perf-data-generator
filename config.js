'use strict';

const uuid = require('node-uuid');

module.exports = {
	LMS_URL: process.env.LMS_URL || "http://kd82-cgalvin:44444",//process.env.npm_package_config_lms_url,
	TENANT_ID: process.env.TENANT_ID || "ec63dd64-de40-489c-a63f-b1295d8a277f",//process.env.npm_package_config_tenant_id || uuid(),
	AUTH_SERVICE: process.env.AUTH_SERVICE || "https://auth-dev.proddev.d2l/core/",//process.env.npm_package_config_auth_service,
	//BFS_URL: process.env.BFS_URL || //process.env.npm_package_config_bfs_url,
	//DEVICE_TOKEN: process.env.DEVICE_TOKEN || process.env.npm_package_config_device_token,
	//DEVICE_PLATFORM: process.env.DEVICE_PLATFORM || process.env.npm_package_config_device_platform,
	USERNAME: process.env.USERNAME || "d2luser",//process.env.npm_package_config_username,
	PASSWORD: process.env.PASSWORD || "password",//process.env.npm_package_config_password,
	LOAD_LIMIT: process.env.LOAD_LIMIT || 1024,
	EXPORT_TEMPLATE: process.env.EXPORT_TEMPLATE || process.env.npm_package_config_export_template
};
