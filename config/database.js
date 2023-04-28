const mongoose = require("mongoose");

const PORT = 3000 || process.env.PORT;
const connectDatabase = (app) => {
  const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  };
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.DB_URL, option).then((data) => {
    console.log(`Mongodb connected with server: ${data.connection.host}`);
    // const server =
    app.listen(PORT, () => {
      console.log(`server is runing on PORT ${process.env.PORT}`);
    });
  });
  // .catch((err) => {
  //   console.log(err);
  // });
};

module.exports = connectDatabase;
