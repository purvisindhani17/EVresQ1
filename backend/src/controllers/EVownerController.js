const asyncHandler=require('express-async-handler');
const EVowner=require('../models/Evowner');
const generateToken=require('../config/generateToken')
const Host=require('../models/Host');
const HomeChargerBooking = require('../models/HomeChargerBooking');
const DriverBooking = require("../models/DriverBooking");
const Driver = require("../models/Driver");

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
  const { hostId, timeSlot, chargerType,latitude,longitude} = req.body;

  if (!hostId || !timeSlot || !chargerType) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const existingBooking = await HomeChargerBooking.findOne({
    EVowner: req.user.id,
    host: hostId,
    status: { $nin: ["completed", "rejected"] }
  });

  if (existingBooking) {
    return res.status(400).json({
      message: "You already have an active booking with this host",
      status: existingBooking.status
    });
  }

  const booking = await HomeChargerBooking.create({
    EVowner: req.user.id,   // logged-in EV owner
    host: hostId,            // selected host
    timeSlot,
    chargerType,
    status: "requested",
    latitude,
    longitude
  });

  res.status(201).json({
    message: "Charging request sent successfully",
    booking
  });
});

const getMyBookingForHost = asyncHandler(async (req, res) => {
  const booking = await HomeChargerBooking.findOne({
    EVowner: req.user.id,
    host: req.params.hostId,
    status: { $nin: ["rejected"] }
  }).sort({ createdAt: -1 });

  res.json(booking || null);
});

const getMyBookingForDriver = asyncHandler(async (req, res) => {
  const booking = await DriverBooking.findOne({
    EVowner: req.user.id,
    driver: req.params.driverId,
    status: { $in: ["accepted", "on_the_way", "completed"] },
  }).sort({ updatedAt: -1 });

  res.json(booking || null);
});


const getHostById = asyncHandler(async (req, res) => {
  try {
    const host = await Host.findById(req.params.hostId).select("-password");
    if (!host) {
      res.status(404);
      throw new Error("Host not found");
    }
    res.json(host);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const updateBookingLocation = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.body;
  await HomeChargerBooking.findByIdAndUpdate(req.params.bookingId, {
    latitude,
    longitude,
    updatedAt: new Date()
  });

  res.json({ success: true });
});

const bookingloocation = asyncHandler(async (req, res) => {
  res.set("Cache-Control", "no-store");
  const booking = await HomeChargerBooking.findById(req.params.bookingId)
    .select("latitude longitude");

  res.json(booking);
});

//
const requestDriver = asyncHandler(async (req, res) => {
  const { latitude, longitude, address, note } = req.body;

  const existing = await DriverBooking.findOne({
    EVowner: req.user.id,
    status: { $nin: ["requested","rejected", "on_the_way"] },
  });

  if (existing) {
    return res.status(400).json({
      message: "You already have an active driver request",
    });
  }

  const booking = await DriverBooking.create({
    EVowner: req.user.id,
    pickupLocation: {
      latitude,
      longitude,
      address,
    },
    note,
  });

  res.status(201).json({
    message: "Driver request sent to nearby drivers",
    booking,
  });
});

const getMyDriverRequest = asyncHandler(async (req, res) => {
  const booking = await DriverBooking.findOne({
    EVowner: req.user.id,
    status: { $nin: ["rejected"] },
  })
    .populate("driver", "-password")
    .sort({ createdAt: -1 });

  res.json(booking || null);
});

const getDriverById = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.driverId).select("-password");
  res.json(driver);
})

const updateBookingLocationforDriver = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.body;
  await DriverBooking.findByIdAndUpdate(
  req.params.bookingId,
  {
    pickupLocation: {
      latitude,
      longitude
    },
    updatedAt: new Date()
  }
);


  res.json({ success: true });
});

const bookingloocationfordriver = asyncHandler(async (req, res) => {
  res.set("Cache-Control", "no-store");
  const booking = await DriverBooking.findById(req.params.bookingId)
    .select("pickupLocation");

  res.json(booking);
});



module.exports={registeredUser,allUsers,getAllHosts,bookHomeCharger,getMyBookingForHost,getHostById,updateBookingLocation, bookingloocation,requestDriver,getMyDriverRequest,getDriverById,updateBookingLocationforDriver,bookingloocationfordriver,getMyBookingForDriver};