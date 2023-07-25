import multer from "multer";


const storage = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname);
  }
});

const upload = multer({ storage })

export const uploadImage = upload.single('avatar')

// req.file.path -> permite acceder a la imagen luego