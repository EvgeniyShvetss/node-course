const {Router} = require("express");
const Course = require("../models/course")
const auth = require('../middleware/auth')
const router = Router()

const mapCartItems = (cart) => {
 return cart.items.map((c) =>({
    ...c.courseId._doc, count: c.count
   }))
}

const calculatePrice = (cource) => {
 return cource.reduce((acc, cur) => acc + cur.price,0)
}

router.post('/add', auth, async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)

    res.redirect('/card') 
})

router.get('/', auth, async (req, res) => {
    const user = await req.user.populate(['cart.items.courseId'])

   const courses = mapCartItems(user.cart)

   res.render('card', {
    title: 'Card',
    isCard: true,
    courses: courses,
    price: calculatePrice(courses)
   })
})

router.delete('/remove:id', auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate(['cart.items.courseId'])
    const course = mapCartItems(user.cart)
    const cart = {
        course, price: calculatePrice(course)
    }

    res.status(200).json(cart)
})


module.exports = router