const asynchandler = require('express-async-handler');
import { Request, Response } from 'express';
const Camp = require('../models/campmodel');
// create new camp
const newCamp =  asynchandler(
    async (req: { body: { name: any; location: any; description: any; }; file: { location: any; }; userId: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }) => {
        const { name, location, description } = req.body;
        const imageUrl = req.file.location; // get the URL of the uploaded image from Amazon S3
        console.log(imageUrl)
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
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: `${error}` });
        }
      });
//search
const searchCampgrounds = asynchandler(async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const campgrounds = await Camp.search(query);
  res.json(campgrounds);
});
const allCampgrounds = asynchandler(
  async (req: any, res: { json: (arg0: any) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {
    try {
      const campgrounds = await Camp.find({});
      res.json(campgrounds);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
)
module.exports = {
    newCamp,searchCampgrounds,allCampgrounds
}