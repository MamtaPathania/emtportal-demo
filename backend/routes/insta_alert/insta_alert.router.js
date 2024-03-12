const express = require('express');
const {alertdetails, getdatedetails, getlogindetails, getlogsdetails, getinfodetails, getmonthdetails} = require('./insta_alert.controller');
const router = express.Router();
// const multer = require('multer');
// const upload = multer({ storage: multer.memoryStorage() });

router.get('/insta-alert',alertdetails)

router.get('/date',getdatedetails)

router.get('/access-logs',getlogsdetails)

router.get('/info',getinfodetails)

router.get('/month',getmonthdetails)

router.post('/login',getlogindetails)

// router.post('/send-email',upload.single('file'),maildetails)

module.exports = router;