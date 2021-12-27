import sjson from 'superjson';
// function reviver<T extends SuperJSONValue>(_key: any, value: SuperJSONValue) {
// 	return sjson.deserialize<T>(value);
// }
function safeStringify(obj: object) {
	return sjson.stringify(obj);
}
function safeParse(this: any, str: string) {
	return sjson.parse(str);
}

export default {
	// reviver: reviver,
	safeStringify: safeStringify,
	safeParse: safeParse,
};
