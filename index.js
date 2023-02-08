const express = require('express');
const path = require('path');
const csrf = require('csurf');
const mongoose = require('mongoose');//import the 'mongoose' module
const app = express();//application object express
const session = require('express-session');//connect the 'express-sessions' middleware
//created a MongoStore class, obligatory after connecting express-session
const MongoStore = require('connect-mongodb-session')(session);//will synchronise the express-session with the Mongo session
const flash = require('connect-flash');//error transport using a session
const PORT = process.env.PORT || 3000;
const mainRoutes = require('./routs/main');
const addRoutes = require('./routs/add');
const coursesRoutes = require('./routs/courses');
const cardRoutes = require('./routs/card');
const orderRoutes = require('./routs/orders');
const authRoutes = require('./routs/auth');
const User = require('./models/user');
const varMiddleware = require('./middleware/variables');//connect our middleware from the 'widdleware/variables.js' file
const userMiddleware = require('./middleware/user');//connect our middleware from the 'widdleware/user.js'


//from version 4.6.0 on,  Handlebars used:
// terminal: npm install @handlebars/allow-prototype-access
//  terminal: npm install express-handlebars
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const exphbs = require('express-handlebars'); //https://github.com/express-handlebars/express-handlebars
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars) //from version 4.6.0 on,  Handlebars used
})
const MONGODB_URI = `mongodb+srv://anode:bOKT2JLZavt6zpY3@cluster0.o5pllfj.mongodb.net/shop`;/*cloud.mongodb.com ->Database Deployments->
                                                                                            connect-> connect your application*/

//create a new instance of the class MongoStore
const store = new MongoStore({
    collection: 'sessions',// the place where the sessions are stored
    uri: MONGODB_URI// url database
})

// View engine
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');


//set up a static folder
app.use(express.static(path.join(__dirname, 'public')));


//set up middleware 'urlencoded'
app.use(express.urlencoded({extended: true}));


//set up middleware 'express-sessions', to access the req.session object and store data within the session
app.use(session({
    secret:'some secret value',//session encryption key
    resave: false, //you need to re-save the session to the repository
    saveUninitialized: false, //if 'true', empty sessions will go into the repository
    store:store
}));

app.use(csrf());
app.use(flash());


//set up 'varMiddleware'
app.use(varMiddleware);

//set up 'userMiddleware'
app.use(userMiddleware);


//router registration
app.use('/', mainRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', orderRoutes);
app.use('/auth', authRoutes);


//connected to the mongodb database
async function start() {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            // useFindAndModify: false
        });

        app.listen(PORT, () => {
            console.log(`Server is running or port ${PORT}`)
        })

    } catch (e) {
        console.log(e)
    }
}

start();









