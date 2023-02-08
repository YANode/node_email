const {Router} = require('express');
const router = Router();

//refactoring: leave the 'Course' model unchanged
const Course = require('../models/course');

const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Add new course',
        isAdd: true
    });
})

//middleware at the route level - creating a new course
router.post('/', auth, async (req, res) => {

    //refactoring: const course = new Course(req.body.title, req.body.price, req.body.img);
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user._id//_id user from mongodb

    })

    //eliminated possible errors
    try {
        await course.save();
        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }
})

module.exports = router;
