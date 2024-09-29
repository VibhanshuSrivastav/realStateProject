function isAdminAuthenticated(req, res, next) {
    console.log('Session data:', req.session); // Log session data for debugging
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        res.redirect('/login');
    }
}

module.exports = {isAdminAuthenticated} ;