const JS_DATE_REGEX = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/;

function reviver(key: any, value: string | number | Date) {
	return typeof value === 'string' && JS_DATE_REGEX.test(value) ? new Date(value) : value;
}
function safeStringify(obj: any) {
	return typeof obj !== 'undefined' ? JSON.stringify(obj) : obj;
}
function safeParse(
	this: {
		reviver: (key: any, value: string | number | Date) => string | number | Date;
		safeStringify: (obj: any) => string | undefined;
		safeParse: (str: string) => any;
	},
	str: string
) {
	return typeof str !== 'undefined' ? JSON.parse(str, this.reviver) : str;
}

export default {
	reviver: reviver,
	safeStringify: safeStringify,
	safeParse: safeParse,
};
