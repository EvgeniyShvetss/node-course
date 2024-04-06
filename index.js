const express = require("express");
const csurf = require("csurf")
const helmet = require('helmet')
const compression = require('compression')
const flash = require("connect-flash")
const exphbs = require("express-handlebars");
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const profile = require("./routes/profile");
const coursesRoutes = require("./routes/courses");
const cardRoutes = require("./routes/card");
const orderRoutes = require("./routes/order");
const authRoutes = require("./routes/auth");
const path = require("path")
const mongoose = require("mongoose") 
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const varMiddlewave = require("./middleware/variables")
const userMiddleware = require("./middleware/user")
const keys = require('./keys')
const SibApiV3Sdk = require('@getbrevo/brevo');
const errorHandler = require('./middleware/error')
const fileMiddleware = require('./middleware/file')

let apiInstance = new SibApiV3Sdk.AccountApi();

apiInstance.setApiKey(SibApiV3Sdk.AccountApiApiKeys.apiKey, keys.SEND_GRID_API_KEY)

const apiKey = 'k0IcFD0nhJKGM8bRlrIunwDVQvZrlj9XWO49bk5vrFYXUbt4O1IzBI84LPb7io51'
const pasword = 'GraGUHsyFlhLHGqY'


const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs.helpers')
})

const store = MongoStore({
    collections: 'sessions',
    uri: keys.MONGO_URI,
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(fileMiddleware.single('avatar'))
app.use(csurf())
app.use(flash())
app.use(helmet())
app.use(compression())
app.use(varMiddlewave)
app.use(userMiddleware) 

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes) 
app.use('/card', cardRoutes)
app.use('/order', orderRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profile)

app.use(errorHandler)


const PORT = 300

async function start() {
    try {
        await mongoose.connect(keys.MONGO_URI)
        await apiInstance.getAccount()

        app.listen(PORT, () => {
            console.log('server is running...');
        })
    } catch (error) {
        console.log(error);
    }

}

start()

