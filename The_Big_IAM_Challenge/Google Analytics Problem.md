# Google Analytics Problem

## Description

We created our own analytics system specifically for this challenge. We think it's so good that we even used it on this page. What could go wrong?

Join our queue and get the secret flag.

## IAM Policy

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "sqs:SendMessage",
                "sqs:ReceiveMessage"
            ],
            "Resource": "arn:aws:sqs:us-east-1:092297851374:wiz-tbic-analytics-sqs-queue-ca7a1b2"
        }
    ]
}
```

## Solution
This problem involves the "wiz-tbic-analytics-sqs-queue-ca7a1b2" SQS's SendMessage and ReceiveMessage permissions, which are open to anyone (Principal: *) to perform actions like sending or receiving messages.

(Note: Although it was initially thought that external access was possible, SQS could only be accessed through the provided WEB CLI in The Big IAM Challenge.)

Messages received from this SQS contained a URL, and accessing this URL would allow obtaining the flag.

SQS URL Format: https://sqs.{REGION}.amazonaws.com/{Queue-Owner-AWS-Account-ID}/{SQS-NAME}

## Proof of Concept (PoC)
Receive a message from the SQS.

```json
> aws sqs receive-message --queue-url "https://sqs.us-east-1.amazonaws.com/092297851374/wiz-tbic-analytics-sqs-queue-ca7a1b2"
{
    "Messages": [
        {
            "MessageId": "8fad8513-6249-4c6e-9e81-7478e0a667b6",
            "ReceiptHandle": "...(truncated)...",
            "MD5OfBody": "4cb94e2bb71dbd5de6372f7eaea5c3fd",
            "Body": "{\"URL\": \"https://tbic-wiz-analytics-bucket-b44867f.s3.amazonaws.com/pAXCWLa6ql.html\", \"User-Agent\": \"Lynx/2.5329.3258dev.35046 libwww-FM/2.14 SSL-MM/1.4.3714\", \"IsAdmin\": true}"
        }
    ]
}
```
Access the URL in the Body to obtain the flag.
