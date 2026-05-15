const axios = require('axios');
require('dotenv').config();

// JDoodle Language IDs
const LANGUAGE_IDS = {
  javascript: "nodejs",
  python: "python3",
  cpp: "cpp",
  java: "java",
};

async function runCode(code, languageId) {
  const clientId = process.env.JDOODLE_CLIENT_ID;
  const clientSecret = process.env.JDOODLE_CLIENT_SECRET;

  if (!clientId || clientId === "your_client_id_here" || !clientSecret || clientSecret === "your_client_secret_here") {
    return "JDoodle API key is not configured. Please add JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET to the server/.env file to run code.";
  }

  const options = {
    method: 'POST',
    url: 'https://api.jdoodle.com/v1/execute',
    headers: {
      'content-type': 'application/json'
    },
    data: {
      clientId: clientId,
      clientSecret: clientSecret,
      script: code,
      language: languageId,
      versionIndex: "0"
    }
  };

  try {
    const response = await axios.request(options);
    const result = response.data;

    if (result.error) return "Error: " + result.error;
    return result.output || "No output";
  } catch (error) {
    console.error("Error executing code via JDoodle:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to execute code");
  }
}

module.exports = { runCode, LANGUAGE_IDS };
