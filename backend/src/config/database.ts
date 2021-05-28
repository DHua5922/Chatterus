import mongoose from 'mongoose';

const MONGOURI = "mongodb+srv://DHua5922:blackhand12345@cluster0.prj56.mongodb.net/chatterus?retryWrites=true&w=majority";

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export default module.exports = InitiateMongoServer;
