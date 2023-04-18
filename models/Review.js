"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//Define review schema
const ReviewSchema = new mongoose_1.default.Schema({
    emojiRating: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    campgroundId: {
        type: String,
        required: true,
    },
    postedBy: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    }
});
module.exports = mongoose_1.default.model('Review', ReviewSchema);
//# sourceMappingURL=Review.js.map