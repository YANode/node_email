//connected  from the 'mongoose' package the class 'Schema' and function 'model'
const {Schema, model} = require('mongoose');

//create 'user' object of the 'Schema' class
const userSchema = new Schema({
    email: {
        type: String,
        required: true  //field is mandatory
    },
    name: {
        type: String
    },
    password: {
        type: String,
        required: true//field is mandatory
    },
    cart: {
        items: [ //purchase items
            {
                count: {
                    type: Number,
                    require: true,
                    default: 1 //default quantity = 1
                },
                courseId: { //to link tables in the database
                    type: Schema.Types.ObjectId,
                    ref: 'Course', //linking with the model/course.js -> 'model('Course', course)' table in the database
                    required: true
                }
            }
        ]
    }
});

//add item to cart
userSchema.methods.addToCart = function (course) {


    /*extended code start

        //const clonedItems = this.cart.items.concat();
        //or
       const clonedItems = [...this.cart.items]; //clone the array items

        //find the index of the 'course' we want to put in the cart
        const idx = clonedItems.findIndex(c=>{ //at each iteration we get a course object
            return c.courseId.toString() === course._id.toString();
            if (idx>=0) {
                //there is a course with this index - let's increase the "count" by 1
                 clonedItems[idx].count = this.cart.items[idx].count + 1
            }else{
                clonedItems.push({
                    count: 1,
                    courseId: course._id
                })
            }
        })
        const newCart = {items: cloneItems}
        this.cart = newCart;

   extended code end */

    //simplified code start
    const items = [...this.cart.items];
    const idx = items.findIndex(c => {
        return c.courseId.toString() === course._id.toString();
    })

    if (idx >= 0) {
        items[idx].count = items[idx].count + 1;
    } else {
        items.push({
            count: 1,
            courseId: course._id,
        })
    }

    this.cart = {items};
    //simplified code end

    return this.save();
}

//remove the course with the specified id from the cart
userSchema.methods.removeFromCart = function (id) {//'id' - of the course to be deleted
    //clone the array items
    let items = [...this.cart.items];
    //find the course index to be deleted
    const idx = items.findIndex(c => {
        return c.courseId.toString() === id.toString();//'courseId' - courseId from userSchema
    })

    if (items[idx].count === 1) {
        items = items.filter(c => {//creates a new array, filtering out all elements that satisfy the condition
            return c.courseId.toString() !== id.toString();
        })
    } else {
        items[idx].count--;
    }

    this.cart = {items};
    return this.save();
}

//creating a method for clearing  the cart
userSchema.methods.clearCart = function () {
    this.cart = {items: []};
    return this.save();
}


//register a new 'User' model with the 'userSchema' schema
module.exports = model('User', userSchema);








