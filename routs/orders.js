//get the router object from the library
const {Router} = require('express');
const router = Router();
const Order = require('../models/order');//import the Order model
const auth = require('../middleware/auth');


//route to order formation data, getting a list of orders
router.get('/', auth, async (req, res) => {
    try {
        // get a list of all orders that match user_id
        const orders = await Order.find({
            'user.userId': req.user._id //if 'user.userId' from orderSchema = current "req.user._id"
        })
            .populate('user.userId')//fetching all content from the 'userId' database to the specified path

        res.render('orders', {
            title: 'Orders', // seo-title the tab
            isOrder: true, // active link to the page navbar.hbs
            orders: orders.map(o => {
                return {
                    ...o._doc,
                    // for each element of the array 'courses' run the function,
                    // pass the intermediate result as the first argument further
                    price: o.courses.reduce((total, c) => {
                        return total += c.count * c.course.price
                    }, 0)
                }
            })
        })

    } catch (e) {
        console.log('Error =>', e)
    }


})


//middleware at the route level - creating new order
router.post('/', auth, async (req, res) => {
    try {
        const user = await req.user//get user
            .populate('cart.items.courseId')//fetching all content from the 'courseId' database to the specified path

        //return the data on all courses in the cart without meta
        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: {...i.courseId}//clone and output the content of the 'course' without metadata
        }));

        //created new object 'order'
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user._id,
            },
            courses: courses,
        });

        await order.save();//waiting for a new order to be saved
        await req.user.clearCart();//after saving an order, clear the cart
        res.redirect('/orders');
    } catch (e) {
        console.log('Error=>', e);
    }


})


//export the router object
module.exports = router;
