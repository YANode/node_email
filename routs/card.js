//get the router object from the library
const {Router} = require('express');
const router = Router();

//connect the Card model, Course model
const Course = require('../models/course');

const auth = require('../middleware/auth');

//return the data on all courses in the cart without meta
function mapCartItems(cart) {
    return cart.items.map(c => ({//iteration of all courses in the cart
        ...c.courseId._doc, //clone and output the content of the 'course' without metadata
        id: c.courseId.id, //changed _id to id
        count: c.count
    }))
}

//calculation of the total price of all courses in the cart
function computePrice(courses) {
    // for each element of the array 'courses' run the function,
    // pass the intermediate result as the first argument further
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    }, 0)

}

//sending data to the server, added course to cart
router.post('/add', auth, async (req, res) => {
    //refactoring: const course = await Course.getById(req.body.id)
    const course = await Course.findById(req.body.id);
    // refactoring: await Card.add(course) => added 'course' in the cart
    await req.user.addToCart(course);
    res.redirect('/card')//redirecting the response
})

//add a route to the Router object, exit to cart page
router.get('/', auth, async (req, res) => {

    /*refactoring:   const card = await Card.fetch();
                     res.render('card', {
                         title: 'Cart',
                         isCard: true,
                         courses: card.courses,
                         price: card.price
                         */
    const user = await req.user //get user
        .populate('cart.items.courseId') //fetching all content from the 'courseId' database to the specified path

    //forming an array of courses in the user's cart
    const courses = mapCartItems(user.cart);
    res.render('card', {
        title: 'Cart',
        isCard: true,
        courses: courses,
        price: computePrice(courses),//total price
    })
})

//removed course from cart
router.delete('/remove/:id', auth, async (req, res) => { //read the id of the 'course' to be deleted
    /*refactoring: const card = await Card.remove(req.params.id); //update the 'card' object with the received id*/
    await req.user.removeFromCart(req.params.id);

    const user = await req.user.populate('cart.items.courseId');

    const courses = mapCartItems(user.cart);

    const cart = {
        courses,
        price: computePrice(courses)
    }

    res.status(200).json(cart); //send the 'card' to the server
})


//export the router object
module.exports = router


