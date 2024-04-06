const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        console.log(file, 'file');
        cb(null, 'images')
    },
    filename(req, file, cb) {
        console.log(file, 'file2');
        cb(null, new Date().toISOString() + '_' + file.originalname)
    }
});

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req, file, cb) => {
 
    if(allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    }else {
        cb(null, false)
    }
}

module.exports = multer({
    storage, fileFilter
})