const { google } = require('googleapis');
const oauth2Client = require('../config/googleAuth');

// Konfigurasi OAuth2 Client
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Konfigurasi OAuth2 Client
function getAuthUrl() {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent', // Tambahan ini penting
        include_granted_scopes: false, // Supaya tidak ambil scope lama
    });
}

// Fungsi untuk mendapatkan token dari kode otorisasi
async function setTokenFromCode(code) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens;
}

// Fungsi untuk membuat event di Google Calendar
async function createEvent(eventDetails) {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
        summary: eventDetails.summary,
        location: eventDetails.location,
        description: eventDetails.description,
        start: {
            dateTime: eventDetails.start,
            timeZone: 'Asia/Jakarta',
        },
        end: {
            dateTime: eventDetails.end,
            timeZone: 'Asia/Jakarta',
        },
    };

    return calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
    });
}

module.exports = {
    getAuthUrl,
    setTokenFromCode,
    createEvent,
};
