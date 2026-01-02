const asyncHandler=require('express-async-handler');
const EVowner=require('../models/Evowner');
const generateToken=require('../config/generateToken')
const Host=require('../models/Host');
const HomeChargerBooking = require('../models/HomeChargerBooking');

const registeredUser=asyncHandler(async (req,res)=>{
      const {name,email,password,phone}=req.body;
      if (!name || !email || !password || !phone) {
          res.status(400);
          throw new Error("Please Enter all the Feilds");
      }
      const userExists=await EVowner.findOne({email});
      if (userExists) {
          res.status(400);
          throw new Error("User already exists");
      }
      const user = await EVowner.create({name,email,password,phone});
      if (user) {
        const token = generateToken(user._id, "EVowner");
          res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            token:token
          });
        } else {
          res.status(400);
          throw new Error("User not found");
        }
});

const allUsers = asyncHandler(async (req, res) => {
  console.log("🔍 Backend Received Search Query:", req.query.search);
  console.log("🛠 Authenticated User:", req.user);

  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } }, // Case insensitive
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  console.log(" Searching Users in DB with:", JSON.stringify(keyword));

  try {
      const users = await EVowner.find(keyword).find({ _id: { $ne: req.user._id } });
      console.log("✅ Users Found:", users);
      res.send(users);
  } catch (error) {
      console.error("❌ Error Searching Users:", error);
      res.status(500).json({ message: "Error fetching users" });
  }
});

const getAllHosts = asyncHandler(async (req, res) => {
  const hosts = await Host.find().select("-password");

  res.status(200).json(hosts);
});

const bookHomeCharger = asyncHandler(async (req, res) => {
  console.log("REQ.USER 👉", req.user);
  const { hostId, timeSlot, chargerType } = req.body;

  if (!hostId || !timeSlot || !chargerType) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const booking = await HomeChargerBooking.create({
    EVowner: req.user.id,   // logged-in EV owner
    host: hostId,            // selected host
    timeSlot,
    chargerType,
    status: "requested"
  });

  res.status(201).json({
    message: "Charging request sent successfully",
    booking
  });
});



module.exports={registeredUser,allUsers,getAllHosts,bookHomeCharger};