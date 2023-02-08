//middleware: if user is not authorised - redirect to login page
module.exports = function (req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/login');
    }
    next();
}