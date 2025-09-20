import mongoose from "mongoose";

const db_connect = async () => {
  try {
    await mongoose.connect(process.env.database, {
     
    });
    console.log("✅ MongoDB Connected...");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);

  }
};

export default db_connect;
