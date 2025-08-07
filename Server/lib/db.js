// built for connecting to mongodb
import mongoose from "mongoose";
// function to connect to the database
export const connectDB = async () => {
  try {
    // connect to the database using mongoose
    mongoose.connection.on("connected", () =>
      console.log("MongoDB connected successfully")
    );
    await mongoose.connect(`${process.env.MONGO_URI}/chat-app`, {
      writeConcern: { w: "majority" },
      retryWrites: true,
    });
  } catch (error) {
    console.log(error);
  }
};
