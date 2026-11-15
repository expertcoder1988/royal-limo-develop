import mongoose from "mongoose";

export const connect = () => {
  console.log("Mongo URI:", process.env.MONGO_URI); // Check if the URI is loaded correctly
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process if connection fails
  });
};
