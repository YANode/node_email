//connected  from the 'mongoose' package the class 'Schema' and function 'model'
const {Schema, model} = require('mongoose');

//create a new 'course' object of the 'Schema' class
const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    img: String,
    userId: { //to link tables in the database
        type: Schema.Types.ObjectId,
        ref: 'User' //linking with the model/user.js -> 'model('User', userSchema)' table in the database
        }
})

//data transformation in the 'course' object
courseSchema.method('toClient', function() {
    //get the 'course' object
    const course = this.ObjectId;
    //changed _id to id
    course.id = course._id;
    //deleted no need information
    delete course._id;

    return course;
})


//exported 'model'
module.exports = model('Course', courseSchema);