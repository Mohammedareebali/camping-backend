"use strict";
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const authVerify = require('../middleware/authmiddleware');
const { newCamp: postCamp, searchCampgrounds: search, allCampgrounds: campgrounds, getOneCamp: oneCamp } = require('../controllers/userControls');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
require('dotenv').config({ path: '../.env' });
console.log(process.env.AWS_ACCESS_KEY_ID);
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credential: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }, sslEnabled: false,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
});
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET,
        ACL: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname);
        },
    }),
});
// POST route to create a new camp
router.post('/createcamp', authVerify, upload.single('image'), postCamp);
//post route to for search
router.get('/search', search);
// get all campgrounds
router.get("/campgrounds", campgrounds);
//get one campground 
router.get("/campgrounds/:id", oneCamp);
module.exports = router;
//# sourceMappingURL=userRoutes.js.map