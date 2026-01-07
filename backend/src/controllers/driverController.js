const asyncHandler=require('express-async-handler');
const Driver=require('../models/Driver');
const generateToken=require('../config/generateToken');
const DriverBooking = require("../models/DriverBooking");
const EVowner = require("../models/Evowner");

const registeredUser=asyncHandler(async (req,res)=>{
      const {name,email,password,phone,licenseNumber, vehicleNumber,preferredLocation,latitude,longitude}=req.body;
      if (!name || !email || !password || !phone || !licenseNumber || !vehicleNumber || !preferredLocation || !latitude || !longitude) {
          res.status(400);
          throw new Error("Please Enter all the Feilds");
      }
      const userExists=await Driver.findOne({email});
      if (userExists) {
          res.status(400);
          throw new Error("User already exists");
      }
      const user = await Driver.create({name,email,password,phone,licenseNumber,vehicleNumber,preferredLocation, latitude,longitude});
      if (user) {
        const token = generateToken(user._id,"Driver");
          res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            licenseNumber: user.licenseNumber,
            vehicleNumber: user.vehicleNumber,
            preferredLocation: user.preferredLocation,
            latitude: user.latitude,
            longitude: user.longitude,
            isAvailable: user.isAvailable,
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
      const users = await Driver.find(keyword).find({ _id: { $ne: req.user._id } });
      console.log("✅ Users Found:", users);
      res.send(users);
  } catch (error) {
      console.error("❌ Error Searching Users:", error);
      res.status(500).json({ message: "Error fetching users" });
  }
});

const getAllDriverRequests = asyncHandler(async (req, res) => {
  const requests = await DriverBooking.find({
  EVowner: { $ne: null },     // 👈 IMPORTANT
  $or: [
    { status: "requested" },
    { driver: req.user.id }
  ]
})
.populate("EVowner", "-password");
  res.json(requests);
});

const acceptDriverRequest = asyncHandler(async (req, res) => {
  const booking = await DriverBooking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Request not found");
  }

  booking.driver = req.user.id;
  booking.status = "accepted";
  await booking.save();

  res.json({ message: "Request accepted", booking });
});

const rejectDriverRequest = asyncHandler(async (req, res) => {
  const booking = await DriverBooking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Request not found");
  }

  booking.status = "rejected";
  await booking.save();

  res.json({ message: "Request rejected" });
});

const startTrip = asyncHandler(async (req, res) => {
  const booking = await DriverBooking.findById(req.params.id);

  booking.status = "on_the_way";
  await booking.save();

  res.json({ message: "Trip started" });
});

const completeTrip = asyncHandler(async (req, res) => {
  const booking = await DriverBooking.findById(req.params.id);

  booking.status = "completed";
  await booking.save();

  res.json({ message: "Trip completed" });
});

const getownerById = asyncHandler(async (req, res) => {
  const owner = await EVowner.findById(req.params.evOwnerId);

  if (!owner) {
    res.status(404);
    throw new Error("EV Owner not found");
  }

  const booking = await DriverBooking.findOne({
    EVowner: owner._id,
    driver: req.user.id
  });

  res.json({
    name: owner.name,
    phone: owner.phone,
    email: owner.email,
    booking: booking
      ? { status: booking.status }
      : null,
  });
});

// Complete trip and delete booking
const completeBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await DriverBooking.findById(bookingId);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Mark completed first (optional)
    booking.status = "completed";
    await booking.save();

    // Then delete booking from DB
    await DriverBooking.findByIdAndDelete(bookingId);

    res.status(200).json({ message: "Trip completed and booking removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports={registeredUser,allUsers, getAllDriverRequests,
  acceptDriverRequest,
  rejectDriverRequest,
  startTrip,
  completeTrip,getownerById,completeBooking};
