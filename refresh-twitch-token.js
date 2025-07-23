// refresh-twitch-token.js
const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("dotenv").config({ path: ".env.local" });

const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_SECRET;
const ENV_PATH = path.resolve(__dirname, ".env.local");

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Missing TWITCH_CLIENT_ID or TWITCH_SECRET in .env.local");
  process.exit(1);
}

const getNewAccessToken = async () => {
  try {
    const { data } = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      null,
      {
        params: {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: "client_credentials",
        },
      }
    );

    return data.access_token;
  } catch (err) {
    console.error(
      "Failed to get access token:",
      err.response?.data || err.message
    );
    process.exit(1);
  }
};

const updateEnvFile = (newToken) => {
  const envContent = fs.readFileSync(ENV_PATH, "utf8");
  const updatedEnv = envContent.replace(
    /TWITCH_ACCESS_TOKEN=.*/g,
    `TWITCH_ACCESS_TOKEN=${newToken}`
  );

  fs.writeFileSync(ENV_PATH, updatedEnv, "utf8");
  console.log("✅ .env.local updated with new TWITCH_ACCESS_TOKEN");
};

(async () => {
  const newToken = await getNewAccessToken();
  updateEnvFile(newToken);
})();
