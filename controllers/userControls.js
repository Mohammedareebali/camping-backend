"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asynchandler = require('express-async-handler');
const fetch = require("node-fetch");
const Camp = require('../models/campmodel');
// create new camp
const geocode = asynchandler(async (location) => {
    const encodedLocation = encodeURIComponent(location);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedLocation}.json?access_token=pk.eyJ1IjoibW9oYW1tZWQtYXJlZWIiLCJhIjoiY2t6ZDdpcG1rMDQyODJwcGMwOGZvZDVveCJ9.VtXqwPfArJoSqOLzFAfu1g`;
    const response = await fetch(url);
    const data = await response.json();
    const [longitude, latitude] = data.features[0].center;
    return [longitude, latitude];
});
const newCamp = asynchandler(async (req, res) => {
    const { name, location, description, bed, reviews, wifi, price } = req.body;
    const imageUrl = req.file.location;
    const userId = req.userId;
    console.log(req.body);
    console.log(price);
    try {
        const coordinates = await geocode(location); // get coordinates using Mapbox geocoding
        const newCamp = new Camp({
            price,
            name,
            location,
            coordinates,
            imageUrl,
            description,
            userId,
            bed,
            reviews,
            wifi
        });
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
//all camogrounds
const allCampgrounds = asynchandler(async (req, res) => {
    const perPage = 4;
    const page = req.query.page || 1;
    try {
        const campgrounds = await Camp.find()
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec();
        const count = await Camp.countDocuments().exec();
        res.json({
            campgrounds,
            current: page,
            pages: Math.ceil(count / perPage)
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
//get one camp
const getOneCamp = asynchandler(async (req, res) => {
    try {
        const campground = await Camp.findById(req.params.id);
        if (!campground) {
            return res.status(404).json({ message: "Campground not found" });
        }
        res.json(campground);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch campground details" });
    }
});
module.exports = {
    newCamp, searchCampgrounds, allCampgrounds, getOneCamp
};
//# sourceMappingURL=userControls.js.map