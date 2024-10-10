const jwt = require("jsonwebtoken");
function generateAccessToken(payload) {
  const accessToken = jwt.sign(
    {
      payload,
    },
    process.env.ACCESS_TOKEN_KEY,
    { expiresIn: "10d" }
  );
  return accessToken;
}
function generateRefreshToken(payload) {
  const refreshToken = jwt.sign(
    {
      payload,
    },
    process.env.REFRESH_TOKEN_KEY,
    { expiresIn: "365d" }
  );
  return refreshToken;
}
module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
