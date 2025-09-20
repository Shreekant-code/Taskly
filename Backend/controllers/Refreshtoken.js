import jwt from "jsonwebtoken";

export const refreshToken = (req, res) => {
  try {
    // 1️⃣ Get refresh token from cookies
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token provided" });

    // 2️⃣ Verify refresh token
    jwt.verify(token, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) {
        // Optionally clear cookie on invalid token
        res.clearCookie("refreshToken", { httpOnly: true, secure: true });
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // 3️⃣ Generate new access token
      const accessToken = jwt.sign(
        { id: decoded.id, email: decoded.email },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" }
      );

      // 4️⃣ Send new access token
      res.status(200).json({ accessToken });
    });
  } catch (error) {
    console.error("Error in refresh token:", error);
    res.status(500).json({ message: "Server error" });
  }
};
