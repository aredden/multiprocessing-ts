'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
const superjson_1 = __importDefault(require('superjson'));
// function reviver<T extends SuperJSONValue>(_key: any, value: SuperJSONValue) {
// 	return sjson.deserialize<T>(value);
// }
function safeStringify(obj) {
	return superjson_1.default.stringify(obj);
}
function safeParse(str) {
	return superjson_1.default.parse(str);
}
exports.default = {
	// reviver: reviver,
	safeStringify: safeStringify,
	safeParse: safeParse,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbImpzb24tdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwREFBOEI7QUFDOUIsaUZBQWlGO0FBQ2pGLHVDQUF1QztBQUN2QyxJQUFJO0FBQ0osU0FBUyxhQUFhLENBQUMsR0FBVztJQUNqQyxPQUFPLG1CQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFDRCxTQUFTLFNBQVMsQ0FBWSxHQUFXO0lBQ3hDLE9BQU8sbUJBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUVELGtCQUFlO0lBQ2Qsb0JBQW9CO0lBQ3BCLGFBQWEsRUFBRSxhQUFhO0lBQzVCLFNBQVMsRUFBRSxTQUFTO0NBQ3BCLENBQUMifQ==
