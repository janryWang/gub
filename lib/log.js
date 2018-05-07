"use strict";

var chalk = require("chalk");

var moment = require("moment");

var pkg = require("../package.json");

var log = console.log;

var getCurDate = function getCurDate() {
  return moment().format("YYYY-MM-DD hh:mm:ss");
};

var getMessage = function getMessage(type, msg, color) {
  if (color === void 0) {
    color = "yellow";
  }

  return log(chalk[color]("\u3010" + pkg.name.toUpperCase() + " " + getCurDate() + "\u3011" + type.toUpperCase() + ": " + msg));
};

exports.success = function (msg) {
  return getMessage("success", msg, "green");
};

exports.error = function (msg) {
  return getMessage("error", msg, "red");
};

exports.info = function (msg) {
  return getMessage("info", msg, "yellow");
};

exports.flat = function (msg, color) {
  if (color === void 0) {
    color = "yellow";
  }

  return log(chalk[color](msg));
};