import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; // sesuaikan path jika file berbeda

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/stakeholderDB";

const users = [
  {name: "BPMA Admin", email: "bpma@gmail.com", password: "123456", role: "bpma" },
  {name: "Medco E&P Malaka", email: "medco@gmail.com", password: "123456", role: "kkks" },
  {name: "Triangle Pase Inc.", email: "triangle@gmail.com", password: "123456", role: "kkks" },
  {name: "Zaratex", email: "zaratex@gmail.com", password: "123456", role: "kkks" },
  {name: "Pema Global Energi", email: "pema@gmail.com", password: "123456", role: "kkks" },
  {name: "Aceh Energy", email: "aceh.energy@gmail.com", password: "123456", role: "kkks" },
];

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log("MongoDB Connected");

  await User.deleteMany();
  console.log("Previous users removed");

  const hashedUsers = await Promise.all(users.map(async (user) => ({
    ...user,
    password: await bcrypt.hash(user.password, 10),
  })));

  await User.insertMany(hashedUsers);
  console.log("User seeding completed.");

  process.exit();
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});
