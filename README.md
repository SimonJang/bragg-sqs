# bragg-sqs [![Build Status](https://travis-ci.org/SimonJang/bragg-sqs.svg?branch=master)](https://travis-ci.org/SimonJang/bragg-sqs)

> SQS middleware for [bragg](https://github.com/SamVerschueren/bragg)

Handle SQS events as bragg requests.

## About

SQS is an [event source](https://docs.aws.amazon.com/lambda/latest/dg/invoking-lambda-function.html#supported-event-source-sqs) for AWS Lambda, see the link for more information about configuration. **Keep in mind that in case of errors, the request is retried untill it succeeds or the message retention period is expired**.

[Source: Retries on error with event sources with AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/retries-on-errors.html)

> If you configure an Amazon SQS queue as an event source, AWS Lambda will poll a batch of records in the queue and invoke your Lambda function. If it fails, AWS Lambda will continue to process other messages in the batch. Meanwhile, AWS Lambda will continue to retry processing the failed message.


## Install

```
$ npm install bragg-sqs
```


## Usage

```js
const app = require('bragg')();
const router = require('bragg-router')();
const sqs = require('bragg-sqs');

// Listen for events in the `TopicName` topic
router.post('sqs:QueueName', ctx => {
    ctx.body = ctx.request.body;
});

app.use(sqs());
app.use(router.routes());

exports.handler = app.listen();
```

The `sqs:` prefix is added by the middleware to the queuename from where the events are generated. The message of the event is provided in the `body` property of the `request` object.

## API

### braggSqs()

Install the bragg SQS middleware.


## License

MIT © [Simon](https://github.com/SimonJang)
