const express = require("express");
const app = express();
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
const errorMiddleWare = require("./middleware/error");
const notFoundError = require("./middleware/404");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

// app.set("trust proxy", true);
app.use(cors({ credentials: true, origin: true }));
app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.status(200).json("App is running perfectly");
});
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

app.use(notFoundError);
app.use(errorMiddleWare);

module.exports = app;
