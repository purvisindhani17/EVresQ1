const express= require('express');
const router=express.Router()
const {registeredUser,allUsers,getAllRequests,approveRequest,rejectRequest,startCharging,completeCharging} = require('../controllers/hostController')
const {protect}=require('../middleware/authMiddleware')
const {getBookingById} = require('../controllers/hostController');

router.route('/').post(registeredUser).get(protect,allUsers);
router.get('/dashboard', protect, getAllRequests);
router.patch("/approve/:id", protect, approveRequest);
router.patch("/reject/:id", protect, rejectRequest);
router.patch("/start/:id", protect, startCharging);
router.patch("/complete/:id", protect, completeCharging);
router.get("/booking/:id", protect, getBookingById);

module.exports=router;