const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const errorhandler = require("errorhandler")

require('dotenv').config();
const isProduction = process.env.NODE_ENV === "production";

// Create global app object
const app = express();

app.use(cors({
  origin: '*'
}));

// Normal express config defaults
app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require("method-override")());
app.use(express.static(__dirname + "/public"));

if (!isProduction) {
  app.use(errorhandler());
}

app.use(require("./routes"));

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function (err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 8080, function () {
  console.log("Listening on port " + server.address().port);
});

// const http = require('./services/http');
// const test = async () => {
//   const assets = await http.getAssets('0x640464206E1d302Ce6D1C97e309E22BfF4555dAe', '0x9ab2bdcd7c18be6c1a09d61fb064fb259f0d45da');
//   console.log(assets);
// }
// test();

// const service = require('./services/contract');
// const transfer = async () => {
//   const result = await service.transfer_priority_tokens();
//   if (result !== 1) {
//     await service.transfer();
//   }
//   setTimeout(() => transfer(), 1000);
// }
// setTimeout(() => transfer(), 1000);
