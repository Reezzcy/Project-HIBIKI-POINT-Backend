const extractUserFromHeader = (req, res, next) => {
    try {
        // Ambil header X-User-Data
        const userDataHeader = req.headers['x-user-data'];

        if (userDataHeader) {
            // Decode base64 dan parse JSON
            const userDataString = Buffer.from(userDataHeader, 'base64').toString('utf-8');
            req.user = JSON.parse(userDataString);
            console.log('User data extracted:', req.user);
        } else {
            console.log('No user data found in headers');
        }
    } catch (error) {
        console.error('Error extracting user data:', error);
    }

    next();
};

module.exports = { extractUserFromHeader };