const {Schema, model} = require('mongoose')

const course = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    id: {
        type: Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    img: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

 module.exports = model('Courses', course) 