// src/App.js
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import AwsDashboard from "./AwsDashboard";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [awsData, setAwsData] = useState({});
  const [sdkOption, setSdkOption] = useState("backend");
  const [credentials, setCredentials] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const handleLogin = async ({
    accessKey,
    secretKey,
    sdkOption,
    mfaSerial,
    mfaCode,
  }) => {
    setSdkOption(sdkOption);
    setCredentials({ accessKey, secretKey, mfaSerial, mfaCode });

    if (sdkOption === "backend") {
      try {
        const loginRes = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
            mfaSerial,
            mfaCode,
          }),
        });
        if (!loginRes.ok) throw new Error("Backend login failed");
        const loginData = await loginRes.json();
        setUserInfo(loginData);
        setLoggedIn(true);
      } catch (err) {
        alert("Login Error: " + err.message);
      }
    }
  };

  const fetchService = async (serviceName) => {
    const endpoints = {
      s3: "/api/buckets",
      ec2: "/api/instances",
      dynamodb: "/api/tables",
      sqs: "/api/queues",
      sns: "/api/topics",
    };

    try {
      const res = await fetch(endpoints[serviceName]);
      const data = await res.json();
      setAwsData({ [serviceName]: data });
    } catch (err) {
      alert("Error fetching " + serviceName.toUpperCase() + ": " + err.message);
    }
  };

  return loggedIn ? (
    <AwsDashboard
      awsData={awsData}
      fetchService={fetchService}
      userInfo={userInfo}
    />
  ) : (
    <LoginForm onLogin={handleLogin} />
  );
}

export default App;

// import React, { useState } from "react";
// import LoginForm from "./LoginForm";
// import AwsDashboard from "./AwsDashboard";

// function App() {
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [buckets, setBuckets] = useState([]);

//   const handleLogin = async ({ accessKey, secretKey, sdkOption }) => {
//     if (sdkOption === "browser") {
//       // Use Browser SDK
//       const { S3Client, ListBucketsCommand } = await import(
//         "@aws-sdk/client-s3"
//       );
//       const client = new S3Client({
//         region: "us-east-1",
//         credentials: {
//           accessKeyId: accessKey,
//           secretAccessKey: secretKey,
//         },
//       });

//       try {
//         const command = new ListBucketsCommand({});
//         const response = await client.send(command);
//         setBuckets(response.Buckets || []);
//         setLoggedIn(true);
//       } catch (err) {
//         alert("Browser SDK Error: " + err.message);
//       }
//     } else {
//       // Use Backend SDK
//       try {
//         const loginRes = await fetch("/api/login", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ accessKey, secretKey }),
//         });
//         if (!loginRes.ok) throw new Error("Backend login failed");

//         const bucketRes = await fetch("/api/buckets");
//         const data = await bucketRes.json();
//         setBuckets(data || []);
//         setLoggedIn(true);
//       } catch (err) {
//         alert("Backend SDK Error: " + err.message);
//       }
//     }
//   };

//   return loggedIn ? (
//     <AwsDashboard buckets={buckets} />
//   ) : (
//     <LoginForm onLogin={handleLogin} />
//   );
// }

// export default App;
