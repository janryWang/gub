"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.removeAliasViewer = exports.updateAliasViewer = exports.selectAliasViewer = exports.createAliasViewer = exports.getAliasList = exports.removeAlias = exports.addAlias = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var log = require("./log");

var fs = require("fs-extra");

var path = require("path");

var inquirer = require("inquirer");

var LZ = require("lz4");

var homedir = require("homedir");

var DB_PATH = path.resolve(homedir(), "./.gub_storage_db");

var readDB =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(path) {
    var file;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fs.readFile(path);

          case 2:
            file = _context.sent;
            _context.prev = 3;
            return _context.abrupt("return", JSON.parse(LZ.decode(file)));

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](3);
            return _context.abrupt("return", []);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 7]]);
  }));

  return function readDB(_x) {
    return _ref.apply(this, arguments);
  };
}();

var writeDB =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(path, data) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return fs.writeFile(path, LZ.encode(JSON.stringify(data)));

          case 2:
            return _context2.abrupt("return", _context2.sent);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function writeDB(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var required = function required(input) {
  if (input) return true;else return "This field is required";
};

var addAlias =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(url, alias) {
    var dataSource;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(!url || !alias)) {
              _context3.next = 2;
              break;
            }

            return _context3.abrupt("return");

          case 2:
            _context3.next = 4;
            return fs.ensureFile(DB_PATH);

          case 4:
            _context3.next = 6;
            return readDB(DB_PATH);

          case 6:
            dataSource = _context3.sent;

            if (!dataSource.find(function (item) {
              return item.url === url;
            })) {
              _context3.next = 9;
              break;
            }

            return _context3.abrupt("return");

          case 9:
            if (Array.isArray(dataSource)) {
              dataSource = dataSource.concat({
                url: url,
                alias: alias
              });
            } else {
              dataSource = [{
                url: url,
                alias: alias
              }];
            }

            _context3.next = 12;
            return writeDB(DB_PATH, dataSource);

          case 12:
            return _context3.abrupt("return", _context3.sent);

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function addAlias(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

exports.addAlias = addAlias;

var removeAlias =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(key, alias) {
    var dataSource;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return fs.ensureFile(DB_PATH);

          case 2:
            _context4.next = 4;
            return readDB(DB_PATH);

          case 4:
            dataSource = _context4.sent;
            dataSource = dataSource.filter(function (item) {
              return item.key === key && item.alias === alias;
            });
            _context4.next = 8;
            return writeDB(DB_PATH, dataSource);

          case 8:
            return _context4.abrupt("return", _context4.sent);

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function removeAlias(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

exports.removeAlias = removeAlias;

var getAliasList =
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5() {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return fs.ensureFile(DB_PATH);

          case 2:
            _context5.next = 4;
            return readDB(DB_PATH);

          case 4:
            return _context5.abrupt("return", _context5.sent);

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function getAliasList() {
    return _ref5.apply(this, arguments);
  };
}();

exports.getAliasList = getAliasList;

var createAliasViewer =
/*#__PURE__*/
function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee6() {
    var res;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return inquirer.prompt([{
              type: "input",
              name: "url",
              validate: required,
              message: "Please input the repository url"
            }, {
              type: "input",
              name: "alias",
              validate: required,
              message: "Please input an alias"
            }]);

          case 2:
            res = _context6.sent;
            _context6.next = 5;
            return addAlias(res.url, res.alias);

          case 5:
            log.success("Successful operation!");

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function createAliasViewer() {
    return _ref6.apply(this, arguments);
  };
}();

exports.createAliasViewer = createAliasViewer;

var selectAliasViewer =
/*#__PURE__*/
function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee7() {
    var dataSource, _ref8, alias;

    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return getAliasList();

          case 2:
            dataSource = _context7.sent;

            if (!(dataSource.length == 0)) {
              _context7.next = 7;
              break;
            }

            log.error("Alias not found, please create an alias first!");
            process.exit(0);
            return _context7.abrupt("return");

          case 7:
            _context7.next = 9;
            return inquirer.prompt([{
              type: "list",
              name: "alias",
              validate: required,
              choices: dataSource.map(function (i) {
                return i.alias;
              }),
              message: "Please select an alias"
            }]);

          case 9:
            _ref8 = _context7.sent;
            alias = _ref8.alias;
            return _context7.abrupt("return", dataSource.filter(function (i) {
              return i.alias === alias;
            })[0].url);

          case 12:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function selectAliasViewer() {
    return _ref7.apply(this, arguments);
  };
}();

exports.selectAliasViewer = selectAliasViewer;

var updateAliasViewer =
/*#__PURE__*/
function () {
  var _ref9 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee8() {
    var dataSource, _ref10, alias, newDatasource, i, item, _item;

    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return getAliasList();

          case 2:
            dataSource = _context8.sent;

            if (!(dataSource.length == 0)) {
              _context8.next = 7;
              break;
            }

            log.error("Alias not found, please create an alias first!");
            process.exit(0);
            return _context8.abrupt("return");

          case 7:
            _context8.next = 9;
            return inquirer.prompt([{
              type: "list",
              name: "alias",
              validate: required,
              choices: dataSource.map(function (i) {
                return i.alias + (" (" + i.url + ")");
              }),
              message: "Please select an alias"
            }]);

          case 9:
            _ref10 = _context8.sent;
            alias = _ref10.alias;
            newDatasource = [];
            i = 0;

          case 13:
            if (!(i < dataSource.length)) {
              _context8.next = 26;
              break;
            }

            item = dataSource[i];

            if (!(alias.indexOf(item.alias) > -1)) {
              _context8.next = 22;
              break;
            }

            _context8.next = 18;
            return inquirer.prompt([{
              type: "input",
              name: "url",
              validate: required,
              "default": item.url,
              message: "Please input the repository url"
            }, {
              type: "input",
              name: "alias",
              validate: required,
              "default": item.alias,
              message: "Please input an alias"
            }]);

          case 18:
            _item = _context8.sent;
            newDatasource.push(_item);
            _context8.next = 23;
            break;

          case 22:
            newDatasource.push(item);

          case 23:
            i++;
            _context8.next = 13;
            break;

          case 26:
            _context8.next = 28;
            return writeDB(DB_PATH, newDatasource);

          case 28:
            log.success("Successful operation!");

          case 29:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function updateAliasViewer() {
    return _ref9.apply(this, arguments);
  };
}();

exports.updateAliasViewer = updateAliasViewer;

var removeAliasViewer =
/*#__PURE__*/
function () {
  var _ref11 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee9() {
    var dataSource, _ref12, alias;

    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return getAliasList();

          case 2:
            dataSource = _context9.sent;

            if (!(dataSource.length == 0)) {
              _context9.next = 7;
              break;
            }

            log.error("Alias not found, please create an alias first!");
            process.exit(0);
            return _context9.abrupt("return");

          case 7:
            _context9.next = 9;
            return inquirer.prompt([{
              type: "list",
              name: "alias",
              validate: required,
              choices: dataSource.map(function (i) {
                return i.alias + (" (" + i.url + ")");
              }),
              message: "Please select an alias"
            }]);

          case 9:
            _ref12 = _context9.sent;
            alias = _ref12.alias;
            dataSource = dataSource.filter(function (i) {
              return i.alias + (" (" + i.url + ")") !== alias;
            });
            _context9.next = 14;
            return writeDB(DB_PATH, dataSource);

          case 14:
            log.success("Successful operation!");

          case 15:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function removeAliasViewer() {
    return _ref11.apply(this, arguments);
  };
}();

exports.removeAliasViewer = removeAliasViewer;