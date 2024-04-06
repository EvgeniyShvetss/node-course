const {Router} = require("express");
const Courses = require("../models/course")
const auth = require('../middleware/auth')
const router = Router()

router.get('/', async (req, res) => {
    const courses = await Courses.find().populate('userId').lean()
    res.render('courses', {
        title: 'courses',
        isCourses: true,
        courses: courses,
        userId: req.user ? req.user._id.toString() : null
    })
})

router.get('/:id/edit', auth, async (req, res) => {
  if(!req.query.allow) {
    return res.redirect("/")
  }

  try {
    const course = await Courses.findById(req.params.id).lean()

    if(course.userId._id.toString() !== req.user._id.toString() ){
      return res.redirect('/courses')
    }

    res.render('course-edit', {
      title: `Edit ${course.title}`,
      course: course
    })
  } catch (error) {
    
  }
 

})  

router.post('/remove', auth, async (req, res) => {
  try {
    await Courses.deleteOne({_id: req.body.id})
    res.redirect('/courses')
  } catch (error) {
    console.log(error);
  }
})


router.post('/edit', auth, async (req, res) => {
  const {id} = req.body
  delete req.body.id
    await Courses.findByIdAndUpdate(id, req.body)
    return res.redirect("/courses")
})
 
router.get('/:id', async (req, res) => {
    const course = await Courses.findById(req.params.id).lean()
    res.render('course', {
        layout: 'empty',
        title: `course ${course?.title}`,
        course
    })
})



module.exports = router