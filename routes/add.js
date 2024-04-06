const {Router} = require("express");
const Courses = require('../models/course')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'add',
        isAdd: true,
    })
})

router.post('/', auth, async (req, res) => {
 
    const course = new Courses({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    })

    try {
        await course.save()
        res.redirect('/courses')
    } catch (error) {
        console.log(error);
    }

    
})


module.exports = router