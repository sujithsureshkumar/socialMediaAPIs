const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
        type: String,
        required: true,
      },
    description: {
      type: String,
      max: 500,
    },
    likes: {
      type: Array,
      default: [],
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        default: [],
      }],
     comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Comment",
        default: [],
      }],
     /* comments: {
        type: Array,
        default: [],
      }*/
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);