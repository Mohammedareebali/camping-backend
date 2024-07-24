import mongoose from "mongoose";
//Define review schema
const ReviewSchema = new mongoose.Schema({
    emojiRating: {
type : Number,
required:true,
    },
    createdAt: {
type : Date,
default :Date.now,
    },
    campgroundId:{
        type: String,
        required:true,
    },
    postedBy:{
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    }
})
module.exports = mongoose.model('Review',ReviewSchema)