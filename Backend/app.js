import express from "express";
import db_connect from "./Database/database.js";
import dotenv from "dotenv";
import router from "./Routes/route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


dotenv.config();
const app = express();



app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin); 
  },
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET,
});



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    console.log("insidefilename fxn",file);
    const random=uuidv4();
    cb(null,random+""+file.originalname)
  }
})

const upload = multer({ storage: storage })

app.post('/profile', upload.single('myfile'), async function (req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

   

    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlink(req.file.path,
    (err => {
        if (err) console.log(err);
        else {
            console.log("\nDeleted file: example_file.txt");}
    }));

    res.send({
      message: 'File uploaded successfully',
      cloudinaryUrl: result.secure_url
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).send('Upload failed');
  }
});


app.use("/", router);

await db_connect();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
