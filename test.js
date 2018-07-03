import test from 'ava';
import deepFreeze from 'deep-freeze';
import sqsMiddleware from '.';

const Records = [
	{
		messageId: 'cd269559-a56b-4acd-8cd9-01e31a66b773',
		receiptHandle: 'AQEBi1Qo1ZwuYo6x0UtMjKmWDNOMujTIrwn8EG5iBt8JQ54WKfajuTDngrcFbXMNyvFINE7g7SUNJlzcnCzoaZiGmJTf82vchH5964sBhrbi6HNtzxCJe+dMkDYwBPDBfE76YrA04WBIQ00MgmOWT1j8C3MwIQ6ruK87jQzN4CRNCFKPnS5vxyxTuwy0YEOcXPv8Cflqo75XGKa00813RALWYTZruXMDPtHS57QeMHmZb8uiQFUfdDIP20Kl4dNlAMrSocuNo5IGkaNQP5oSLftzWunWwMUWSfbNz9Oo7QlUx25yNOJjDEJCzc+OyIe/R+Qjz8CbvKthJtvqII9k7KmuQ55tzw093CbB32wsHfEkMJtwom9JWac+q5j37FKGD+J3OT35pDryvTIzTekRx0XtOg==',
		body: '{"foo":"Bar"}',
		attributes: {
			ApproximateReceiveCount: '1',
			SentTimestamp: '1530726973641',
			SenderId: '005279744545',
			ApproximateFirstReceiveTimestamp: '1530726973656'
		},
		messageAttributes: {},
		md5OfBody: '71dc074ea496f27940b882aebe6094a7',
		eventSource: 'aws:sqs',
		eventSourceARN: 'arn:aws:sqs:eu-west-1:005279744545:sqs-trigger-test',
		awsRegion: 'eu-west-1'
	}
];

const doubleRecords = [
	{
		messageId: 'cd269559-a56b-4acd-8cd9-01e31a66b773',
		receiptHandle: 'AQEBi1Qo1ZwuYo6x0UtMjKmWDNOMujTIrwn8EG5iBt8JQ54WKfajuTDngrcFbXMNyvFINE7g7SUNJlzcnCzoaZiGmJTf82vchH5964sBhrbi6HNtzxCJe+dMkDYwBPDBfE76YrA04WBIQ00MgmOWT1j8C3MwIQ6ruK87jQzN4CRNCFKPnS5vxyxTuwy0YEOcXPv8Cflqo75XGKa00813RALWYTZruXMDPtHS57QeMHmZb8uiQFUfdDIP20Kl4dNlAMrSocuNo5IGkaNQP5oSLftzWunWwMUWSfbNz9Oo7QlUx25yNOJjDEJCzc+OyIe/R+Qjz8CbvKthJtvqII9k7KmuQ55tzw093CbB32wsHfEkMJtwom9JWac+q5j37FKGD+J3OT35pDryvTIzTekRx0XtOg==',
		body: '{"foo":"Bar"}',
		attributes: {
			ApproximateReceiveCount: '1',
			SentTimestamp: '1530726973641',
			SenderId: '005279744545',
			ApproximateFirstReceiveTimestamp: '1530726973656'
		},
		messageAttributes: {},
		md5OfBody: '71dc074ea496f27940b882aebe6094a7',
		eventSource: 'aws:sqs',
		eventSourceARN: 'arn:aws:sqs:eu-west-1:005279744545:sqs-trigger-test',
		awsRegion: 'eu-west-1'
	},
	{
		messageId: 'cd269559-a56b-4acd-8cd9-01e31a66b773',
		receiptHandle: 'AQEBi1Qo1ZwuYo6x0UtMjKmWDNOMujTIrwn8EG5iBt8JQ54WKfajuTDngrcFbXMNyvFINE7g7SUNJlzcnCzoaZiGmJTf82vchH5964sBhrbi6HNtzxCJe+dMkDYwBPDBfE76YrA04WBIQ00MgmOWT1j8C3MwIQ6ruK87jQzN4CRNCFKPnS5vxyxTuwy0YEOcXPv8Cflqo75XGKa00813RALWYTZruXMDPtHS57QeMHmZb8uiQFUfdDIP20Kl4dNlAMrSocuNo5IGkaNQP5oSLftzWunWwMUWSfbNz9Oo7QlUx25yNOJjDEJCzc+OyIe/R+Qjz8CbvKthJtvqII9k7KmuQ55tzw093CbB32wsHfEkMJtwom9JWac+q5j37FKGD+J3OT35pDryvTIzTekRx0XtOg==',
		body: '{"foo":"BazBar"}',
		attributes: {
			ApproximateReceiveCount: '1',
			SentTimestamp: '1530726973641',
			SenderId: '005279744545',
			ApproximateFirstReceiveTimestamp: '1530726973656'
		},
		messageAttributes: {},
		md5OfBody: '71dc074ea496f2111111111111',
		eventSource: 'aws:sqs',
		eventSourceARN: 'arn:aws:sqs:eu-west-1:005279744545:sqs-trigger-test',
		awsRegion: 'eu-west-1'
	}
];

const unParseableRecord = [
	{
		messageId: 'cd269559-a56b-4acd-8cd9-01e31a66b773',
		receiptHandle: 'AQEBi1Qo1ZwuYo6x0UtMjKmWDNOMujTIrwn8EG5iBt8JQ54WKfajuTDngrcFbXMNyvFINE7g7SUNJlzcnCzoaZiGmJTf82vchH5964sBhrbi6HNtzxCJe+dMkDYwBPDBfE76YrA04WBIQ00MgmOWT1j8C3MwIQ6ruK87jQzN4CRNCFKPnS5vxyxTuwy0YEOcXPv8Cflqo75XGKa00813RALWYTZruXMDPtHS57QeMHmZb8uiQFUfdDIP20Kl4dNlAMrSocuNo5IGkaNQP5oSLftzWunWwMUWSfbNz9Oo7QlUx25yNOJjDEJCzc+OyIe/R+Qjz8CbvKthJtvqII9k7KmuQ55tzw093CbB32wsHfEkMJtwom9JWac+q5j37FKGD+J3OT35pDryvTIzTekRx0XtOg==',
		body: '<xml><value>Foo</value></xml>',
		attributes: {
			ApproximateReceiveCount: '1',
			SentTimestamp: '1530726973641',
			SenderId: '005279744545',
			ApproximateFirstReceiveTimestamp: '1530726973656'
		},
		messageAttributes: {},
		md5OfBody: '123456789',
		eventSource: 'aws:sqs',
		eventSourceARN: 'arn:aws:sqs:eu-west-1:005279744545:sqs-trigger-test',
		awsRegion: 'eu-west-1'
	}
];

const singleEvent = () => {
	const ctx = {
		request: {},
		req: {
			Records
		}
	};

	sqsMiddleware()(ctx);

	return ctx;
};

const doubleEvent = () => {
	const ctx = {
		request: {},
		req: {
			Records: doubleRecords
		}
	};

	sqsMiddleware()(ctx);

	return ctx;
};

const unParseableEvent = () => {
	const ctx = {
		request: {},
		req: {
			Records: unParseableRecord
		}
	};

	sqsMiddleware()(ctx);

	return ctx;
};

const nonSQSEvent = () => {
	const ctx = {
		request: {
			params: {
				user: 'Foo'
			}
		},
		path: 'login',
		method: 'post'
	};

	sqsMiddleware()(deepFreeze(ctx));

	return ctx;
};

test('middleware should process a SQS event', t => {
	const context = singleEvent();

	t.deepEqual(context.request, {
		body: [
			{
				foo: 'Bar'
			}
		]
	});
	t.deepEqual(context.method, 'post');
	t.deepEqual(context.path, 'sqs:sqs-trigger-test');
});

test('middleware should process multiple SQS events', t => {
	const context = doubleEvent();

	t.deepEqual(context.request, {
		body: [
			{
				foo: 'Bar'
			},
			{
				foo: 'BazBar'
			}
		]
	});
	t.deepEqual(context.method, 'post');
	t.deepEqual(context.path, 'sqs:sqs-trigger-test');
});

test('middleware should return record if not parseable', t => {
	const context = unParseableEvent();

	t.deepEqual(context.request, {
		body: [
			'<xml><value>Foo</value></xml>'
		]
	});
	t.deepEqual(context.method, 'post');
	t.deepEqual(context.path, 'sqs:sqs-trigger-test');
});

test('middleware should ignore non-SQS events', t => {
	const context = nonSQSEvent();

	t.deepEqual(context, {
		request: {
			params: {
				user: 'Foo'
			}
		},
		path: 'login',
		method: 'post'
	});
	t.deepEqual(context.method, 'post');
	t.deepEqual(context.path, 'login');
});
