//get the router object from the library
const {Router} = require('express');//const express = require('express');
//get the router object from the library
const router = Router();//const router = express.Router();
const bcrypt = require('bcryptjs');//provides encryption
const User = require('../models/user');


// content of the login page download by link
router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        isLogin: true,
        //output the errors, if any, to the client
        registerError: req.flash('registerError'),
        loginError: req.flash('loginError')
    })
});

router.get('/logout', async (req, res) => {
    //req.session.isAuthenticated = false; // isAuthenticated is false, if you are logged off
    //or
    req.session.destroy(() => {//clear the session
    res.redirect('/auth/login#login')
    });
});


//post request processing on login tab
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const candidate = await User.findOne({email}); //email is a unique

        if (candidate) {
            //compare the entered password ->'password+hash' with the candidate.password in the database ->'hash'
            const areSame = await bcrypt.compare(password, candidate.password);
            if (areSame) {
                req.session.user = candidate;
                req.session.isAuthenticated = true; // isAuthenticated is true, if you are logged in
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/');
                })

            } else {
                //send error information to the server
                req.flash('loginError', 'Password is incorrect')
                res.redirect('/auth/login#login');
            }
        } else {
            //send error information to the server
            req.flash('loginError', 'No user with this email was found')
            res.redirect('/auth/login#login');
        }
    } catch (e) {
        console.log(e);
    }
})

//registering a new user
router.post('/register', async (req, res) => {
    try {
        const {email, password, repeat, name} = req.body;
        const candidate = await User.findOne({email});//the mail is a unique
        if (candidate) {
            //send error information to the server
            req.flash('registerError', 'User with this email is already registered');
            res.redirect('/auth/login#register');
        } else {
            //if the user with this email address is not registered
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({
                email: email,
                name: name,
                password: hashPassword,
                cart: {items: []}
            });
            await user.save();
            res.redirect('/auth/login#login');
        }
    } catch (e) {
        console.log(e)
    }
})


//export the router object
module.exports = router;
