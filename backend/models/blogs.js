import mongoose from "mongoose";

const { Schema } = mongoose;

const BlogsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
    },
    imageAltText: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model("blog", BlogsSchema);
