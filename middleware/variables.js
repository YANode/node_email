//create a middleware in which we add different parameters to all server responses
module.exports = function (req, res, next) {
    res.locals.isAuth = req.session.isAuthenticated;//isAuth - authorisation complete
    res.locals.csrf = req.csrfToken();//middleware for CSRF token creation and validation
    next(); //to extend the chain of execution of the middleware
}