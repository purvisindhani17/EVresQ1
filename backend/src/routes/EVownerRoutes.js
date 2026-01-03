const express= require('express');
const router=express.Router()
const {registeredUser,allUsers,getAllHosts,bookHomeCharger,getMyBookingForHost} = require('../controllers/EVownerController')
const {protect}=require('../middleware/authMiddleware')

router.route('/').post(registeredUser).get(protect,allUsers);
router.get('/hosts', protect, getAllHosts);
router.post("/book-home-charger", protect, bookHomeCharger);
router.get(
  "/my-booking/:hostId",
  protect,   // EV owner auth
  getMyBookingForHost
);

module.exports=router;
