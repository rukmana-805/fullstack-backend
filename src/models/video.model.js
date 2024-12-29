import mongoose, {Schema} from "mongoose";

//first install it. This is used for 
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({

    videoFile : {
        type : String,
        required : true
    },
    thumbnail : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    duration : {
        type : Number,
        required : true
    },
    view : {
        type : Number,
        default : 0
    },
    isPublished : { // whethere the youtuber published the vdo or not
        type : Boolean,
        default : true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }

}, {timestamps : true})


videoSchema.plugin(mongooseAggregatePaginate)// use as plugins

export const Video = mongoose.model("Video",videoSchema)