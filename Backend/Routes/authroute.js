import express from "express";
import passport from "passport";
import "../Auth/Oauth.js";
import jwt from "jsonwebtoken";

const authrouter = express.Router();

authrouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authrouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    // User authenticated via Google, create a JWT
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.ACCESS_SECRET,
      { expiresIn: "7d" }
    );

    // Create refresh token cookie
    const refreshToken = jwt.sign(
      { id: req.user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

   
    res.redirect(`http://localhost:5173/google/callback?token=${token}`);
  }
);

export default authrouter;
