const multer = require('multer');
const {v4: uuid} = require('uuid')

const storage = multer.diskStorage({
    destination: function(req , file , cb){
        cb(null , './uploads')
    },
    filename:function(req , file , cb){
        console.log("File name ->" , file)
        const random = uuid();
        cb(null, random+""+file.originalname)
    }
});

const upload = multer({storage:storage});

module.exports = upload ;