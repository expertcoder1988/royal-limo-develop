import mongoose from "mongoose";

const { Schema } = mongoose;

const UsersSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNo: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    squareId: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model("user", UsersSchema);
