const {Router} = require('express'); //var express = require('express');
const router = Router();            //var router = express.Router();
const Course = require('../models/course');//connect the "course.js" course creation model

const auth = require('../middleware/auth');

//content of the home page download by link, course list view
router.get('/', async (req, res) => {

    // refactoring: const courses = await Course.getAll() - to retrieve data read from getAll()
    const courses = await Course.find().populate('userId');//added to the 'course' DB information from the 'user' DB:email, name


    //template code output
    res.render('courses', {
        title: 'courses', // seo-title the tab
        isCourses: true, // active link to the page navbar.hbs
        courses,  //object to display on the page
        allowedProtoMethods: {
            courses: true,
        }
    });
})


//edit and load the contents of the 'edit' page by id
router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    //refactoring: const course = await Course.getById(req.params.id) - retrieve data from getById() by id
    const course = await Course.findById(req.params.id);

    //edit page output
    res.render('course-edit', {
        title: `Edit ${course.title}`,
        course
    })
})

// the 'remove' event, that we get from the client when the 'Delete course' button is pressed
router.post('/remove', auth, async (req, res) => {
   try {
       await Course.deleteOne({ _id: req.body.id });
       return res.redirect('/courses');
   } catch (e) {
       console.log(e)
   }

})



// сhanged the data in the server database
router.post('/edit', auth, async (req, res) => {

    //refactoring: await Course.update(req.body)
    //mongoose sets '_id', let's get rid of '_'
    const {id} = req.body;//save the 'id' parameter in a separate variable
    delete req.body.id; //remove the 'id' parameter from 'req.body'
    await Course.findByIdAndUpdate(id, req.body);//'id' does not contain '_'
    return res.redirect('/courses')
})


//open the content 'course' page download by id
router.get('/:id', async (req, res) => {

    //refactoring: const course = await Course.getById(req.params.id) - the place where the identifier is stored
    const course = await Course.findById(req.params.id);

    res.render('course', {
        layout: 'empty',
        title: `Course ${course.title}`,//seo-title the tab
        course//object to display on the page
    })
})

module.exports = router;
