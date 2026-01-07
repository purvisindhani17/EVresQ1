const express= require('express');
const router=express.Router()
const {registeredUser,allUsers,getAllHosts,bookHomeCharger,getMyBookingForHost} = require('../controllers/EVownerController')
const {protect}=require('../middleware/authMiddleware')
const {getHostById,updateBookingLocation, bookingloocation,requestDriver, getMyDriverRequest,getDriverById,updateBookingLocationforDriver,bookingloocationfordriver,getMyBookingForDriver}=require('../controllers/EVownerController')

router.route('/').post(registeredUser).get(protect,allUsers);
router.get('/hosts', protect, getAllHosts);
router.post("/book-home-charger", protect, bookHomeCharger);
router.get(
  "/my-booking/:hostId",
  protect,   // EV owner auth
  getMyBookingForHost
);
router.post("/update-location/:bookingId", protect, updateBookingLocation);
router.get("/booking-location/:bookingId", protect, bookingloocation);

router.post("/request-driver", protect, requestDriver);
router.get("/my-driver-request", protect, getMyDriverRequest);
router.get("/driver/:driverId", protect, getDriverById);
router.post("/update-location-for-driver/:bookingId", protect, updateBookingLocationforDriver);
router.get("/booking-location-for-driver/:bookingId", protect, bookingloocationfordriver);
router.get(
  "/my-driver-booking/:driverId",
  protect,   // EV owner auth
  getMyBookingForDriver
);
router.get("/:hostId", protect, getHostById); // dynamic route last

module.exports=router;
