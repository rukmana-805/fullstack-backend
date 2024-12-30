import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) { //file came at the middle means if someone send any file that are received in file(like req received json or normal text like that)
      cb(null, './public/temp')//destination say where you want to save your asserts
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) //Filename would be the original name that passed by the user(not a good idea though)
    }
  })
  
  export const upload = multer({ storage: storage })