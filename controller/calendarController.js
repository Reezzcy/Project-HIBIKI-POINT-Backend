const calendarService = require('../service/googleCalendarService');

// Controller untuk mengelola Google Calendar
exports.login = (req, res) => {
    const url = calendarService.getAuthUrl();
    res.redirect(url);
};

// Controller untuk menangani callback dari Google setelah login
exports.oauthCallback = async (req, res) => {
    try {
        const { code } = req.query;
        const tokens = await calendarService.setTokenFromCode(code);
        // Simpan token kalau perlu
        res.json({ message: 'Login sukses!', tokens });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller untuk mendapatkan daftar event dari Google Calendar
exports.addEvent = async (req, res) => {
    try {
        const response = await calendarService.createEvent(req.body);
        res.json({ message: 'Event dibuat', link: response.data.htmlLink });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
