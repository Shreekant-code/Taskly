import express from "express";
import multer from "multer";
import { UserRegister, UserLogin,GetUserProfile, UpdateProfile } from "../controllers/useroperation.js";
import { refreshToken } from "../controllers/Refreshtoken.js";
import { verifyToken } from "../Auth/authetification.js";
import { CreateTodo, GetTodobyid, Alltodo, UpdateTodo, Deletebyid } from "../controllers/Todologic.js";

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage });

// User routes
router.post("/registerTodo", upload.single("myfile"), UserRegister); 
router.post("/loginTodo", UserLogin);
router.get("/refresh", refreshToken);

//user profile 

router.get("/profiledetails", verifyToken, GetUserProfile);
router.put("/updatedetails",verifyToken,UpdateProfile);

// Todo routes
router.post("/create", verifyToken, CreateTodo);
router.get("/todo/:id", verifyToken, GetTodobyid);
router.get("/todo", verifyToken, Alltodo);
router.put("/update/:id", verifyToken, UpdateTodo);
router.delete("/delete/:id", verifyToken, Deletebyid);

router.get("/voice-created", (req, res) => {
  const { todo, name } = req.query;

  res.type("text/xml");
  res.send(`
    <Response>
      <Say voice="alice">
        Hello ${name}! Your new todo '${todo}' has been created successfully. Have a productive day!
      </Say>
    </Response>
  `);
});


export default router;
