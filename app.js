const express = require("express");
const app = express();
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const roles = require("./routes/rolesRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
const errorMiddleWare = require("./middleware/error");
const notFoundError = require("./middleware/404");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const { authorizeRole, isAuthenticated } = require("./middleware/auth");

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
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

const routes = [];
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    // Route middleware
    const route = {
      path: middleware.route.path,
      method: Object.keys(middleware.route.methods)[0].toUpperCase(),
    };
    routes.push(route);
  } else if (middleware.name === "router") {
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

app.get(
  "/getAllEndPoints",
  isAuthenticated,
  authorizeRole("admin"),
  (req, res) => {
    res.status(200).json({ routes, count: routes.length });
  }
);

app.use(notFoundError);
app.use(errorMiddleWare);

module.exports = app;
