  require("dotenv").config();

  const jwt = require("jsonwebtoken");
  const User = require("../models/User");

  const addUser = async (req, res) => {
    console.log("Add User !!");
    try {
      const { name, email, password, role } = req.body;
      const user = await User.findOne({ email: email });
      if (user) return res.status(409).json({ error: "User already exists" });

      const newUser = new User({
        name,
        email,
        password, // 🔒 should be hashed later
        role: role || "user",
      });
      await newUser.save();

      return res
        .status(201)
        .json({ success: true, msg: "User Created Successfully" });
    } catch (error) {
      console.log("add user: ", error.message);
      res.status(500).json({ error: error.message });
    }
  };

  const getUser = async (req, res) => {
    console.log("Login User !!");
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ success: false, msg: "User Not Found" });

      const isMatch = password === user.password; // 🔒 later use bcrypt
      if (!isMatch)
        return res.status(401).json({ success: false, msg: "Wrong Password" });

      // Generate Token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
      );

      // Safe user object
      const { password: _, ...safeUser } = user.toObject();

      return res.status(200).json({ success: true, user: safeUser, token });
    } catch (error) {
      console.log("login user: ", error.message);
      res.status(500).json({ msg: error.message });
    }
  };

  module.exports = { addUser, getUser };