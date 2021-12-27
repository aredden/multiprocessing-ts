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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbImpzb24tdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLGFBQWEsR0FBRyw2Q0FBNkMsQ0FBQztBQUVwRSxTQUFTLE9BQU8sQ0FBQyxJQUFTLEVBQUUsS0FBNkI7SUFDeEQsT0FBTyxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUN6RixDQUFDO0FBQ0QsU0FBUyxhQUFhLENBQUMsR0FBVztJQUNqQyxPQUFPLE9BQU8sR0FBRyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQy9ELENBQUM7QUFDRCxTQUFTLFNBQVMsQ0FNakIsR0FBVztJQUVYLE9BQU8sT0FBTyxHQUFHLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUN6RSxDQUFDO0FBRUQsa0JBQWU7SUFDZCxPQUFPLEVBQUUsT0FBTztJQUNoQixhQUFhLEVBQUUsYUFBYTtJQUM1QixTQUFTLEVBQUUsU0FBUztDQUNwQixDQUFDIn0=
