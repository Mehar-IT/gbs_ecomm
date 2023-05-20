const express = require("express");
const app = express();
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const roles = require("./routes/rolesRoute");
const tax = require("./routes/taxRoutes");
const employee = require("./routes/employeeRoute");
const account = require("./routes/accountRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
const category = require("./routes/categoryRoute");
const delivery = require("./routes/deliveryRoute");
const wallet = require("./routes/walletRoute");
const errorMiddleWare = require("./middleware/error");
const notFoundError = require("./middleware/404");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const {
  isAuthenticatedForEmployee,
  authorizePermisions,
} = require("./middleware/auth");

// app.set("trust proxy", true);
app.use(cors({ credentials: true, origin: true }));
app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.status(200).json("app is running perfectly on cyclic");
});
app.use("/api/v1", roles);
app.use("/api/v1", tax);
app.use("/api/v1", employee);
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", category);
app.use("/api/v1", account);
app.use("/api/v1", wallet);
app.use("/api/v1", delivery);

const routes = [];
app._router.stack.forEach((middleware) => {
  // if (middleware.route) {
  //   // Route middleware
  //   const route = {
  //     path: middleware.route.path,
  //     method: Object.keys(middleware.route.methods)[0].toUpperCase(),
  //   };
  //   routes.push(route);
  // } else
  if (middleware.name === "router") {
    // Sub-router middleware
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        const route = {
          path:
            // middleware.regexp.source.replace(/[\\^?(=|)$]/g, "").slice(0, -2) +
            handler.route.path,
          method: Object.keys(handler.route.methods)[0].toUpperCase(),
        };
        routes.push(route);
      }
    });
  }
});

let allRoutes = [];

routes.map(({ path, method }) => {
  if (
    // !path.startsWith("/roles") &&
    // !path.startsWith("/tax") &&
    !path.startsWith("/auth") &&
    !path.startsWith("/orders/createOrder") &&
    !path.startsWith("/orders/getUserOrders") &&
    !path.startsWith("/orders/getSingleOrder") &&
    !path.startsWith("/payment/process-payment") &&
    !path.startsWith("/payment/stripeapikey") &&
    !path.startsWith("/products/getallproducts") &&
    !path.startsWith("/products/getProductDetail") &&
    !path.startsWith("/products/getProductCategories") &&
    !path.startsWith("/users/getUserDetail") &&
    !path.startsWith("/users/password-update") &&
    !path.startsWith("/users/updateProfile") &&
    !path.startsWith("/employee/loginEmployee") &&
    !path.startsWith("/tax/getSingleTax") &&
    !path.startsWith("/tax/getAllTaxes") &&
    !path.startsWith("/tax/getSingleTaxByCountry") &&
    !path.startsWith("/account/get") &&
    !path.startsWith("/wallet/get")
  ) {
    let data = path
      .replace(/[/]/g, " ")
      .substring(1)
      .replace(" :id", "")
      .split(" ");

    allRoutes.push({
      path: path,
      title: data[data.length - 1],
      method: method,
    });
  }
});

app.get(
  "/api/v1/getAllEndPoints",
  isAuthenticatedForEmployee,
  authorizePermisions,
  (req, res) => {
    res.status(200).json({ allRoutes, count: allRoutes.length });
  }
);

app.use(notFoundError);
app.use(errorMiddleWare);

module.exports = app;
