import jsonUtils from './json-utils';
const jobFns: Record<string, any> = {};
const isPromise = (obj: Promise<any> | any) => obj && typeof obj.then === 'function';

function processData(argList: any[], jobId: string | number, index: any) {
	function sendErr(err: Error) {
		try {
			if (process.send)
				if (process.send)
					process.send({
						jobId: jobId,
						error: err.message,
						stack: err.stack,
					});
		} catch (err) {
			console.warn(err);
		}
	}
	function sendSucess(res: any, offset: number) {
		try {
			if (process.send)
				process.send({
					jobId: jobId,
					index: index + offset,
					result: jsonUtils.safeStringify(res),
					jobDone: offset === argList.length - 1,
				});
		} catch (err) {
			console.warn(err);
		}
	}
	async function handlePromise(promise: Promise<any>, offset: any) {
		try {
			const res = await promise;
			return sendSucess(res, offset);
		} catch (err) {
			return sendErr(err as Error);
		}
	}

	try {
		const fn = jobFns[jobId];
		argList.forEach((args: any, offset: any) => {
			const res = fn(args);
			return isPromise(res) ? handlePromise(res, offset) : sendSucess(res, offset);
		});
	} catch (err) {
		return sendErr(err as any as Error);
	}
}

process.on('uncaughtException', (err) => {
	console.error(err);
	process.exit(1);
});

process.on(
	'message',
	(data: {
		argList: string;
		jobId: string | number;
		index: any;
		deregisterJob: any;
		modulePath: string;
		fnStr: string;
	}) => {
		if (data.argList) {
			processData(jsonUtils.safeParse(data.argList), data.jobId, data.index);
		}
		if (data.deregisterJob) {
			delete jobFns[data.jobId];
			return;
		}
		if (data.modulePath) {
			jobFns[data.jobId] = require(data.modulePath);
		}
		if (data.fnStr) {
			let fn: any;
			eval('fn =' + data.fnStr); // eslint-disable-line
			jobFns[data.jobId] = fn;
		}
	}
);
