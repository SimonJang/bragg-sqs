'use strict';
module.exports = () => {
	return ctx => {
		if (!ctx.path && ctx.req.Records && ctx.req.Records.length > 0 && ctx.req.Records[0].eventSource === 'aws:sqs') {
			const sampleRecord = ctx.req.Records[0];
			const queue = sampleRecord.eventSourceARN.split(':').pop();

			const messages = ctx.req.Records.map(record => {
				try {
					return JSON.parse(record.body);
				} catch (err) {
					return record.body;
				}
			});

			ctx.request.body = messages;
			Object.defineProperty(ctx, 'path', {enumerable: true, value: `sqs:${queue}`});
			Object.defineProperty(ctx, 'method', {enumerable: true, value: 'post'});
		}
	};
};
