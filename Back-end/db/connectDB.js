import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // To avoid warnings in the console
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      '%c✅ MongoDB Connected: %c' + conn.connection.host,
      'color: green; font-weight: bold;',
      'color: blue;',
    );
  } catch (error) {
    console.log(
      '%c⚠️ MongoDB Connection Error!',
      'color: red; font-weight: bold;',
      `Error: ${error.message}`,
    );
    process.exit(1);
  }
};

export default connectDB;
