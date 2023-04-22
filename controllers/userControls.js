"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const asynchandler = require('express-async-handler');
const fetch = require("node-fetch");
const Camp = require('../models/campmodel');
const Review = require('../models/Review');
// create new camp
const geocode = asynchandler((location) => __awaiter(void 0, void 0, void 0, function* () {
    const encodedLocation = encodeURIComponent(location);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedLocation}.json?access_token=pk.eyJ1IjoibW9oYW1tZWQtYXJlZWIiLCJhIjoiY2t6ZDdpcG1rMDQyODJwcGMwOGZvZDVveCJ9.VtXqwPfArJoSqOLzFAfu1g`;
    const response = yield fetch(url);
    const data = yield response.json();
    const [longitude, latitude] = data.features[0].center;
    return [longitude, latitude];
}));
const newCamp = asynchandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, location, description, bed, reviews, wifi, price, } = req.body;
    const imageUrl = req.file.location;
    const userId = req.userId;
    console.log(userId);
    console.log(price);
    try {
        const coordinates = yield geocode(location); // get coordinates using Mapbox geocoding
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
        yield newCamp.save();
        res.status(201).json(newCamp);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: `${error}` });
    }
}));
//search
const searchCampgrounds = asynchandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.q;
    const perPage = 4;
    const page = Number(req.query.page) || 1;
    try {
        const count = yield Camp.search(query).countDocuments().exec();
        const totalPages = Math.ceil(count / perPage);
        const current = Math.min(page, totalPages);
        // Ensure that skip value is greater than or equal to 0
        const skipValue = (perPage * current) - perPage;
        const skip = Math.max(0, skipValue);
        const campgrounds = yield Camp.search(query)
            .skip(skip)
            .limit(perPage)
            .exec();
        res.json({
            campgrounds,
            current,
            pages: totalPages
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}));
//all camogrounds
const allCampgrounds = asynchandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const perPage = 4;
    const page = req.query.page || 1;
    try {
        const campgrounds = yield Camp.find()
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec();
        const count = yield Camp.countDocuments().exec();
        res.json({
            campgrounds,
            current: page,
            pages: Math.ceil(count / perPage)
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Erro');
    }
}));
//get one camp
const getOneCamp = asynchandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campground = yield Camp.findById(req.params.id);
        if (!campground) {
            return res.status(404).json({ message: "Campground not found" });
        }
        res.json(campground);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch campground details" });
    }
}));
// create review function
const createReview = asynchandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { emojiRating, comment, campgroundId } = req.body;
        const review = new Review({ campgroundId, emojiRating, comment, postedBy: userId });
        yield review.save();
        res.status(201).json({
            emojiRating,
            comment,
            campgroundId,
            userId
        });
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}));
// get review accroding to campground id 
const getReviewsByCampgroundId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campgroundId = req.params.id;
        const reviews = yield Review.find({ campgroundId }).populate('postedBy', 'username');
        res.status(200).json(reviews);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});
module.exports = {
    newCamp, searchCampgrounds, allCampgrounds, getOneCamp, createReview, getReviewsByCampgroundId
};
//# sourceMappingURL=userControls.js.map