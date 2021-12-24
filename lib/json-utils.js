'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const JS_DATE_REGEX = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/;
function reviver(_key, value) {
	return typeof value === 'string' && JS_DATE_REGEX.test(value) ? new Date(value) : value;
}
function safeStringify(obj) {
	return typeof obj !== 'undefined' ? JSON.stringify(obj) : obj;
}
function safeParse(str) {
	return typeof str !== 'undefined' ? JSON.parse(str, this.reviver) : str;
}
exports.default = {
	reviver: reviver,
	safeStringify: safeStringify,
	safeParse: safeParse,
};
