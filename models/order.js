//connected  from the 'mongoose' package the class 'Schema' and function 'model'
const {Schema, model} = require('mongoose');

//create a new 'orderSchema' object of the 'Schema' class
const orderSchema = new Schema ({
    courses: [{
        course: {
            type: Object,
            required: true,
        },
        count: {
            type: Number,
            required: true,
        }
    }],
    user: {
        name: String,
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    date: {
        type: Date,
        default: Date.now,//not to call the function
    }

})

//exported 'model'
module.exports = model('Order', orderSchema)