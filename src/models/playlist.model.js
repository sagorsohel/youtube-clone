import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const playlistSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        videos: [{
            type: Schema.Types.ObjectId,
            ref: "Video"
        }]
    },{
        timestamps: true
    },{
        timestamps: true
    }
)