import jwt from "jsonwebtoken";
import Todoschema from "../Schema/Todoschema.js";
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Not logged in" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = decoded; // contains user id and email
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const authorizeTodoOwner = async (req, res, next) => {
  const todo = await Todoschema.findById(req.params.id);
  if (!todo) return res.status(404).json({ message: "Todo not found" });

  if (todo.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "You are not allowed to modify this Todo" });
  }

  next();
};