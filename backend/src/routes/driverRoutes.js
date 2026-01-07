const express= require('express');
const router=express.Router()
const {registeredUser,allUsers,getAllDriverRequests,acceptDriverRequest,rejectDriverRequest,startTrip,completeTrip,getownerById,completeBooking} = require('../controllers/driverController')
const {protect}=require('../middleware/authMiddleware');

router.route('/').post(registeredUser).get(protect,allUsers);
router.get("/requests", protect, getAllDriverRequests);
router.patch("/accept/:id", protect, acceptDriverRequest);
router.patch("/reject/:id", protect, rejectDriverRequest);
router.patch("/start/:id", protect, startTrip);
router.patch("/complete/:id", protect, completeTrip);
router.get("/evowner/:evOwnerId", protect, getownerById);
router.delete("/delete-booking/:bookingId", protect, completeBooking);

module.exports=router;
