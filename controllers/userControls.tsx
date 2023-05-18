const asynchandler = require('express-async-handler');
import { error } from 'console';
import { Request, Response } from 'express';
const fetch = require("node-fetch");

const Camp = require('../models/campmodel');
const Review = require('../models/Review');
// create new camp

const geocode = asynchandler( async (location: string) => {
  const encodedLocation = encodeURIComponent(location);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedLocation}.json?access_token=pk.eyJ1IjoibW9oYW1tZWQtYXJlZWIiLCJhIjoiY2t6ZDdpcG1rMDQyODJwcGMwOGZvZDVveCJ9.VtXqwPfArJoSqOLzFAfu1g`;
  const response = await fetch(url);
  const data = await response.json();
  const [longitude, latitude] = data.features[0].center;
  return [longitude, latitude];
});

const newCamp = asynchandler(async (req: { body: {  name: any; location: any; description: any; bed:any;price:any;reviews:any;wifi:any }; file: { location: any; }; userId: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }) => {
  const { name, location, description,bed,reviews,wifi,price, } = req.body;
  const imageUrl = req.file.location;
  const userId = req.userId;
  console.log(userId)
console.log(price)
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `${error}` });
  }
});

//search
const searchCampgrounds = asynchandler(async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const perPage = 4;
  const page = Number(req.query.page) || 1;

  try {
    const count = await Camp.search(query).countDocuments().exec();
    const totalPages = Math.ceil(count / perPage);
    const current = Math.min(page, totalPages);

    // Ensure that skip value is greater than or equal to 0
    const skipValue = (perPage * current) - perPage;
    const skip = Math.max(0, skipValue);

    const campgrounds = await Camp.search(query)
      .skip(skip)
      .limit(perPage)
      .exec();

    res.json({
      campgrounds,
      current,
      pages: totalPages
    });

  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});



  
  
  
  
  
  

//all camogrounds
const allCampgrounds = asynchandler(async (req: any, res: { json: (arg0: { campgrounds: any; current: number; pages: number }) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {
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
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



//get one camp
const getOneCamp = asynchandler(
  async (req: { params: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; json: (arg0: any) => void; }) => {
    try {
      const campground = await Camp.findById(req.params.id);
      if (!campground) {
        return res.status(404).json({ message: "Campground not found" });
      }
      res.json(campground);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch campground details" });
    }
  }
)
// create review function
const createReview = asynchandler( async (req: {
   body: { emojiRating: any; comment: any; campgroundId:any; }; userId: any;
},res: any) => {
  try {
    const userId = req.userId;
    const { emojiRating, comment,campgroundId } = req.body;
    const review = new Review({ campgroundId ,emojiRating, comment,postedBy:userId });
    await review.save();
    res.status(201).json({
      emojiRating,
      comment,
      campgroundId,
      userId
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
});
// get review accroding to campground id 
const getReviewsByCampgroundId = async (req: Request, res: Response) => {
  try {
    const campgroundId = req.params.id;
    const reviews = await Review.find({ campgroundId }).populate('postedBy', 'username');
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};
module.exports = {
    newCamp,searchCampgrounds,allCampgrounds,getOneCamp,createReview,getReviewsByCampgroundId
}