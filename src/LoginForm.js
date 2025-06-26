// src/LoginForm.js
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

export default function LoginForm({ onLogin }) {
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [sdkOption, setSdkOption] = useState("backend");
  const [mfaSerial, setMfaSerial] = useState("");
  const [mfaCode, setMfaCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ accessKey, secretKey, sdkOption, mfaSerial, mfaCode });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        margin: "80px auto",
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fafafa",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5" textAlign="center">
        Enter AWS Credentials
      </Typography>
      <TextField
        label="Access Key ID"
        value={accessKey}
        onChange={(e) => setAccessKey(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Secret Access Key"
        type="password"
        value={secretKey}
        onChange={(e) => setSecretKey(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="MFA Serial (optional)"
        value={mfaSerial}
        onChange={(e) => setMfaSerial(e.target.value)}
        fullWidth
      />
      <TextField
        label="MFA Code (if required)"
        value={mfaCode}
        onChange={(e) => setMfaCode(e.target.value)}
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel>Select SDK</InputLabel>
        <Select
          value={sdkOption}
          onChange={(e) => setSdkOption(e.target.value)}
        >
          <MenuItem value="backend">Backend SDK (Express)</MenuItem>
          <MenuItem value="browser">Browser SDK</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" type="submit">
        Login
      </Button>
    </Box>
  );
}

// import React, { useState } from "react";

// export default function LoginForm({ onLogin }) {
//   const [accessKey, setAccessKey] = useState("");
//   const [secretKey, setSecretKey] = useState("");
//   const [sdkOption, setSdkOption] = useState("browser");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onLogin({ accessKey, secretKey, sdkOption });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Enter AWS Credentials</h2>
//       <input
//         placeholder="Access Key ID"
//         value={accessKey}
//         onChange={(e) => setAccessKey(e.target.value)}
//       />
//       <input
//         placeholder="Secret Access Key"
//         value={secretKey}
//         onChange={(e) => setSecretKey(e.target.value)}
//         type="password"
//       />
//       <label>Select SDK:</label>
//       <select value={sdkOption} onChange={(e) => setSdkOption(e.target.value)}>
//         <option value="browser">Browser SDK (Client)</option>
//         <option value="backend">Backend SDK (Express)</option>
//       </select>
//       <button type="submit">Login</button>
//     </form>
//   );
// }
