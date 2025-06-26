const express = require("express");
const bodyParser = require("body-parser");
const { initAWS } = require("./awsService");
const {
  ListBucketsCommand,
  CreateBucketCommand,
  DeleteBucketCommand,
} = require("@aws-sdk/client-s3");
const { ListQueuesCommand } = require("@aws-sdk/client-sqs");
const { ListTopicsCommand } = require("@aws-sdk/client-sns");
const { DescribeInstancesCommand } = require("@aws-sdk/client-ec2");
const { STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");

const app = express();
app.use(bodyParser.json());

let aws = null;

app.post("/api/login", async (req, res) => {
  try {
    aws = await initAWS(req.body);
    // Get AWS username after login
    const sts = new STSClient({
      region: req.body.region || "us-east-1",
      credentials: {
        accessKeyId: req.body.accessKeyId,
        secretAccessKey: req.body.secretAccessKey,
      },
    });
    const identity = await sts.send(new GetCallerIdentityCommand({}));
    res.send({
      status: "Connected to AWS",
      userArn: identity.Arn,
      userId: identity.UserId,
      account: identity.Account,
    });
  } catch (e) {
    res.status(401).send(e.message);
  }
});

app.get("/api/buckets", async (req, res) => {
  if (!aws) {
    return res
      .status(401)
      .json({ error: "Not authenticated. Please login first." });
  }
  try {
    const s3 = aws.S3();
    const result = await s3.send(new ListBucketsCommand({}));
    res.json(result.Buckets || []);
  } catch (e) {
    console.error("/api/buckets error:", e);
    res.status(500).json({ error: e.message });
  }
});

// Add endpoint to create a new S3 bucket
app.post("/api/buckets", async (req, res) => {
  if (!aws) {
    return res
      .status(401)
      .json({ error: "Not authenticated. Please login first." });
  }
  try {
    const { bucketName } = req.body;
    if (!bucketName)
      return res.status(400).json({ error: "Bucket name required" });
    const s3 = aws.S3();
    await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
    res.json({ status: `Bucket '${bucketName}' created` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add endpoint to delete an S3 bucket
app.delete("/api/buckets/:bucketName", async (req, res) => {
  if (!aws) {
    return res
      .status(401)
      .json({ error: "Not authenticated. Please login first." });
  }
  try {
    const { bucketName } = req.params;
    if (!bucketName)
      return res.status(400).json({ error: "Bucket name required" });
    const s3 = aws.S3();
    await s3.send(new DeleteBucketCommand({ Bucket: bucketName }));
    res.json({ status: `Bucket '${bucketName}' deleted` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/instances", async (req, res) => {
  if (!aws) {
    return res
      .status(401)
      .json({ error: "Not authenticated. Please login first." });
  }
  try {
    const ec2 = aws.EC2();
    const result = await ec2.send(new DescribeInstancesCommand({}));
    res.json(result.Reservations);
  } catch (e) {
    console.error("/api/instances error:", e);
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/tables", async (req, res) => {
  if (!aws) {
    return res
      .status(401)
      .json({ error: "Not authenticated. Please login first." });
  }
  try {
    const dynamo = aws.DynamoDB();
    const result = await dynamo.listTables();
    res.json(result.TableNames);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.get("/api/queues", async (req, res) => {
  if (!aws) {
    return res
      .status(401)
      .json({ error: "Not authenticated. Please login first." });
  }
  try {
    const sqs = aws.SQS();
    const result = await sqs.send(new ListQueuesCommand({}));
    res.json(result.QueueUrls || []);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.get("/api/topics", async (req, res) => {
  if (!aws) {
    return res
      .status(401)
      .json({ error: "Not authenticated. Please login first." });
  }
  try {
    const sns = aws.SNS();
    const result = await sns.send(new ListTopicsCommand({}));
    res.json(result.Topics || []);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// ❌ REMOVE this in dev
// app.use(express.static("build"));

const PORT = 2345; // change to 2345 or other free port

app.listen(PORT, () =>
  console.log(`✅ Backend running at http://localhost:${PORT}`)
);

// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const { initAWS } = require("./awsService");

// const app = express();
// app.use(bodyParser.json());

// let aws = null;

// app.post("/api/login", (req, res) => {
//   aws = initAWS(req.body);
//   res.send({ status: "Connected" });
// });

// app.get("/api/buckets", async (req, res) => {
//   if (!aws) return res.status(401).send("Not authenticated");
//   const s3 = new aws.S3();
//   try {
//     const data = await s3.listBuckets().promise();
//     res.send(data.Buckets);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Serve React build files from the project root's 'build' folder
// app.use(express.static(path.join(__dirname, "..", "build")));

// // Catch-all to serve React's index.html for any other route
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
