// src/AwsDashboard.js
import React from "react";
import { Button, Box, Typography } from "@mui/material";

export default function AwsDashboard({ awsData, fetchService, userInfo }) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        ✅ Connected to AWS
        {userInfo && userInfo.userArn && (
          <span style={{ fontWeight: 400, fontSize: 18, marginLeft: 16 }}>
            as <span style={{ color: "#1976d2" }}>{userInfo.userArn}</span>
          </span>
        )}
      </Typography>
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button variant="outlined" onClick={() => fetchService("s3")}>
          S3 Buckets
        </Button>
        <Button variant="outlined" onClick={() => fetchService("ec2")}>
          EC2 Instances
        </Button>
        <Button variant="outlined" onClick={() => fetchService("dynamodb")}>
          DynamoDB Tables
        </Button>
        <Button variant="outlined" onClick={() => fetchService("sqs")}>
          SQS Queues
        </Button>
        <Button variant="outlined" onClick={() => fetchService("sns")}>
          SNS Topics
        </Button>
      </Box>

      {awsData.s3 && Array.isArray(awsData.s3) && (
        <>
          <Typography variant="h6">S3 Buckets:</Typography>
          {awsData.s3.length === 0 ? (
            <Typography color="text.secondary">No buckets found.</Typography>
          ) : (
            <ul>
              {awsData.s3.map((b, i) => (
                <li key={i}>{b.Name}</li>
              ))}
            </ul>
          )}
          <Box sx={{ mt: 2 }}>
            <CreateBucketForm onCreate={fetchService} />
          </Box>
        </>
      )}
      {awsData.s3 && !Array.isArray(awsData.s3) && (
        <Typography color="error">
          Error:{" "}
          {typeof awsData.s3 === "string"
            ? awsData.s3
            : JSON.stringify(awsData.s3)}
        </Typography>
      )}
      {awsData.ec2 && (
        <>
          <Typography variant="h6">EC2 Instances:</Typography>
          <ul>
            {awsData.ec2.map((res, i) =>
              res.Instances.map((ins) => (
                <li key={ins.InstanceId}>
                  {ins.InstanceId} - {ins.State.Name}
                </li>
              ))
            )}
          </ul>
        </>
      )}
      {awsData.dynamodb && (
        <>
          <Typography variant="h6">DynamoDB Tables:</Typography>
          <ul>
            {awsData.dynamodb.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </>
      )}
      {awsData.sqs && (
        <>
          <Typography variant="h6">SQS Queues:</Typography>
          <ul>
            {awsData.sqs.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </>
      )}
      {awsData.sns && (
        <>
          <Typography variant="h6">SNS Topics:</Typography>
          <ul>
            {awsData.sns.map((t, i) => (
              <li key={i}>{t.TopicArn}</li>
            ))}
          </ul>
        </>
      )}
    </Box>
  );
}

// Add CreateBucketForm component at the bottom
function CreateBucketForm({ onCreate }) {
  const [bucketName, setBucketName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/buckets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucketName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create bucket");
      setSuccess(data.status);
      setBucketName("");
      onCreate("s3"); // refresh bucket list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: 8, alignItems: "center" }}
    >
      <input
        type="text"
        placeholder="New bucket name"
        value={bucketName}
        onChange={(e) => setBucketName(e.target.value)}
        required
        disabled={loading}
      />
      <Button
        type="submit"
        variant="contained"
        size="small"
        disabled={loading || !bucketName}
      >
        {loading ? "Creating..." : "Create Bucket"}
      </Button>
      {error && <span style={{ color: "red" }}>{error}</span>}
      {success && <span style={{ color: "green" }}>{success}</span>}
    </form>
  );
}
