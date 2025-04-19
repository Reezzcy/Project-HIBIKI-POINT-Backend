const calendarService = require('../service/googleCalendarService');

exports.login = (req, res) => {
    const url = calendarService.getAuthUrl();
    res.redirect(url);
};

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

exports.addEvent = async (req, res) => {
    try {
        const response = await calendarService.createEvent(req.body);
        res.json({ message: 'Event dibuat', link: response.data.htmlLink });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
