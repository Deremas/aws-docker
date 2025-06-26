const { S3Client } = require("@aws-sdk/client-s3");
const { EC2Client } = require("@aws-sdk/client-ec2");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { SQSClient } = require("@aws-sdk/client-sqs");
const { SNSClient } = require("@aws-sdk/client-sns");
const { STSClient, GetSessionTokenCommand } = require("@aws-sdk/client-sts");

async function initAWS({
  accessKeyId,
  secretAccessKey,
  region = "us-east-1",
  mfaSerial,
  mfaCode,
}) {
  if (mfaSerial && mfaCode) {
    const sts = new STSClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    const session = await sts.send(
      new GetSessionTokenCommand({
        SerialNumber: mfaSerial,
        TokenCode: mfaCode,
        DurationSeconds: 3600,
      })
    );

    const credentials = session.Credentials;
    return {
      S3: () => new S3Client({ credentials, region }),
      EC2: () => new EC2Client({ credentials, region }),
      DynamoDB: () => new DynamoDBClient({ credentials, region }),
      SQS: () => new SQSClient({ credentials, region }),
      SNS: () => new SNSClient({ credentials, region }),
    };
  }

  const credentials = { accessKeyId, secretAccessKey };
  return {
    S3: () => new S3Client({ credentials, region }),
    EC2: () => new EC2Client({ credentials, region }),
    DynamoDB: () => new DynamoDBClient({ credentials, region }),
    SQS: () => new SQSClient({ credentials, region }),
    SNS: () => new SNSClient({ credentials, region }),
  };
}

module.exports = { initAWS };
