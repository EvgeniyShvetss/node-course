const {Router} = require("express");
const Order = require('../models/order')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({'user.userId': req.user._id}).populate(['user.userId'])
        const mapOrders = orders.map((o) => {
            return {
                ...o._doc,
                price: o.courses.reduce((acc, cur) => acc +  cur.count * cur.course.price,0)
            }
        })

        res.render('order', {
            title: 'Order',
            isOrder: true,
            orders: mapOrders
        })
    } catch (error) {
        console.log(error);
    }

})

router.post('/', auth, async (req, res) => {
    try {
        const user = await req.user.populate(['cart.items.courseId'])
        const courses = user.cart.items.map((c) => ({
            count: c.count,
            course: {...c.courseId._doc}
        }))
    
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user,
            },
            courses: courses
        })
    
        await order.save()
        await req.user.clearCart()

        res.redirect('/order')
    } catch (error) {
        console.log(error);
    }
   
})


module.exports = router