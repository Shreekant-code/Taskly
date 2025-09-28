import express from "express";
import db_connect from "./Database/database.js";
import dotenv from "dotenv";
import router from "./Routes/route.js";
import authrouter from "./Routes/authroute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => callback(null, origin),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sessions
app.use(session({
  secret: "supersecret",
  resave: false,
  saveUninitialized: true
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Load Passport Google OAuth strategy BEFORE mounting authrouter
import "./Auth/Oauth.js"; 

// Mount routes
app.use("/auth", authrouter);   // <-- must come AFTER passport strategy loaded
app.use("/", router);

// Connect DB and start server
await db_connect();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
