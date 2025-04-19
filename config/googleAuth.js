const { google } = require('googleapis');

console.log('CLIENT ID:', process.env.GOOGLE_CLIENT_ID);
console.log('CLIENT SECRET:', process.env.GOOGLE_CLIENT_SECRET);
console.log('REDIRECT URI:', process.env.GOOGLE_REDIRECT_URI);

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

module.exports = oauth2Client;
