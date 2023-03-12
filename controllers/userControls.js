"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asynchandler = require('express-async-handler');
const Camp = require('../models/campmodel');
// create new camp
const newCamp = asynchandler(async (req, res) => {
    const { name, location, description } = req.body;
    const imageUrl = req.file.location; // get the URL of the uploaded image from Amazon S3
    console.log(imageUrl);
    const userId = req.userId; // get the authenticated user's ID from the middleware
    try {
        // Create a new camp
        const newCamp = new Camp({
            name,
            location,
            imageUrl,
            description,
            userId
        });
        // Save the new camp to the database
        await newCamp.save();
        res.status(201).json(newCamp);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: `${error}` });
    }
});
//search
const searchCampgrounds = asynchandler(async (req, res) => {
    const query = req.query.q;
    const campgrounds = await Camp.search(query);
    res.json(campgrounds);
});
module.exports = {
    newCamp, searchCampgrounds
};
//# sourceMappingURL=userControls.js.map