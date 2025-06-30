import mongoose from "mongoose";

const connection = async () => {
  mongoose.connection.on(`connected`, () => console.log(`Database connected`));
  await mongoose.connect(process.env.MONGO_URL);
};

export default connection;
