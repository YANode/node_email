//connect User model
const User = require('../models/user');

//create middleware that receives the object 'req.user' which has mongoose methods
module.exports = async  function (req, res, next) {
    if (! req.session.user) {
        return next();
    }
    req.user = await User.findById(req.session.user._id);
    next();

};
