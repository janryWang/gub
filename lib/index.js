"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _commander = _interopRequireDefault(require("commander"));

var _nanoid = _interopRequireDefault(require("nanoid"));

var _log = _interopRequireDefault(require("./log"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var _gitUsername = _interopRequireDefault(require("git-username"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _execa = _interopRequireDefault(require("execa"));

var _chalk = _interopRequireDefault(require("chalk"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _cliSpinner = require("cli-spinner");

var _getenv = _interopRequireDefault(require("getenv"));

var _escapeStringRegexp = _interopRequireDefault(require("escape-string-regexp"));

var _alias = require("./alias");

var _parseGithubUrl = _interopRequireDefault(require("parse-github-url"));

var banner = "\n\n|||||||||||||||||||||||||||||||||||||||||||||||||||||\n\n Welcome use gub to init your npm package.\n\n  https://github.com/janryWang/gub\n\n|||||||||||||||||||||||||||||||||||||||||||||||||||||\n\n";

var required = function required(input) {
  if (input) return true;else return "This field is required";
};

var getGloabNodeModulesPath = function getGloabNodeModulesPath() {
  return String((0, _getenv["default"])("PATH")).split(":").filter(function (path) {
    return path.indexOf("node") > -1 && path[0] !== ".";
  })[0];
};

var hasTnpm =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var npm;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            npm = getGloabNodeModulesPath();

            if (!npm) {
              _context.next = 7;
              break;
            }

            _context.next = 4;
            return _fsExtra["default"].exists(npm + "/tnpm");

          case 4:
            return _context.abrupt("return", _context.sent);

          case 7:
            return _context.abrupt("return", false);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function hasTnpm() {
    return _ref.apply(this, arguments);
  };
}();

var promiseCall = function promiseCall(fn) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return new Promise(function (resolve, reject) {
    fn.apply(void 0, args.concat([function (err, res) {
      if (!err) {
        resolve(res);
      } else {
        reject(err);
      }
    }]));
  });
};

var transform =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(file_path, fn) {
    var file;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _fsExtra["default"].readFile(file_path, "utf8");

          case 2:
            file = _context2.sent;
            _context2.next = 5;
            return _fsExtra["default"].writeFile(file_path, fn(file), "utf8");

          case 5:
            return _context2.abrupt("return", _context2.sent);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function transform(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 *
 * 1. clone文件到当前目录
 * 2.
 *
 */


var getPkgInfo =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(cwd) {
    var name;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            name = cwd.replace(/.*\/([^\/]+)$/g, "$1");
            _context3.next = 3;
            return _inquirer["default"].prompt([{
              type: "input",
              name: "name",
              validate: required,
              "default": name,
              message: "Please input the package name"
            }, {
              type: "input",
              name: "description",
              message: "Please input the package description"
            }, {
              type: "input",
              name: "version",
              "default": "0.1.0-alpha.0",
              message: "Please input the package version"
            }, {
              type: "input",
              name: "author",
              "default": (0, _gitUsername["default"])({
                cwd: cwd
              }),
              message: "Please input the pacakge author"
            }, {
              type: "input",
              name: "license",
              "default": "MIT",
              message: "Please input the pacakge license"
            }]);

          case 3:
            return _context3.abrupt("return", _context3.sent);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getPkgInfo(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var traverseFile =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(dir, traverse) {
    var files, i, file_path, status, content, newContent;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _fsExtra["default"].readdir(dir);

          case 2:
            files = _context4.sent;
            i = 0;

          case 4:
            if (!(i < files.length)) {
              _context4.next = 31;
              break;
            }

            _context4.prev = 5;
            file_path = _path["default"].join(dir, files[i]);
            _context4.next = 9;
            return _fsExtra["default"].stat(file_path);

          case 9:
            status = _context4.sent;

            if (!status) {
              _context4.next = 24;
              break;
            }

            if (!status.isFile()) {
              _context4.next = 22;
              break;
            }

            _context4.next = 14;
            return _fsExtra["default"].readFile(file_path, "utf-8");

          case 14:
            content = _context4.sent;

            if (!(typeof traverse === "function")) {
              _context4.next = 20;
              break;
            }

            newContent = traverse(content);

            if (!(newContent !== undefined)) {
              _context4.next = 20;
              break;
            }

            _context4.next = 20;
            return _fsExtra["default"].writeFile(file_path, newContent);

          case 20:
            _context4.next = 24;
            break;

          case 22:
            _context4.next = 24;
            return traverseFile(file_path, traverse);

          case 24:
            _context4.next = 28;
            break;

          case 26:
            _context4.prev = 26;
            _context4.t0 = _context4["catch"](5);

          case 28:
            i++;
            _context4.next = 4;
            break;

          case 31:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[5, 26]]);
  }));

  return function traverseFile(_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();

var cloneRepo =
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5(repos, branch, dir) {
    var tmp_path, cwd, spinner, pkg, oldPkgName, newPkgName, tnpm;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (dir === void 0) {
              dir = process.cwd();
            }

            tmp_path = "/tmp/gub_repos/" + (0, _nanoid["default"])();
            cwd = process.cwd();
            spinner = new _cliSpinner.Spinner(_chalk["default"].yellow("Cloning your repository... %s"));
            spinner.setSpinnerString("|/-\\");
            _context5.next = 7;
            return getPkgInfo(cwd);

          case 7:
            pkg = _context5.sent;
            console.log("\n\n");
            spinner.start();
            _context5.prev = 10;

            if (_fsExtra["default"].existsSync(tmp_path)) {
              _context5.next = 14;
              break;
            }

            _context5.next = 14;
            return promiseCall(_mkdirp["default"], tmp_path);

          case 14:
            _context5.next = 16;
            return _execa["default"].shell("git clone " + (branch ? "-b " + branch : "") + " " + repos + " " + tmp_path);

          case 16:
            _context5.next = 18;
            return _fsExtra["default"].copy(tmp_path, dir, {
              overwrite: true,
              filter: function filter(src) {
                if (src.indexOf(".gitignore") > -1) return true;
                return src.indexOf(".git") == -1;
              }
            });

          case 18:
            oldPkgName = "", newPkgName = pkg.name;
            _context5.next = 21;
            return transform(_path["default"].resolve(dir, "./package.json"), function (file) {
              var _pkg = file ? JSON.parse(file) : {};

              oldPkgName = _pkg.name;

              if (file) {
                return JSON.stringify(Object.assign(_pkg, pkg), null, 2);
              } else {
                return JSON.stringify(pkg, null, 2);
              }
            });

          case 21:
            _context5.next = 23;
            return traverseFile(dir, function (target) {
              return target.replace(new RegExp((0, _escapeStringRegexp["default"])(oldPkgName), "ig"), newPkgName);
            });

          case 23:
            _context5.next = 25;
            return hasTnpm();

          case 25:
            tnpm = _context5.sent;
            _context5.next = 28;
            return _execa["default"].shell((tnpm ? "tnpm" : "npm") + " install", {
              cwd: dir
            });

          case 28:
            spinner.stop(true);

            _log["default"].success("🎉🎉 Gub init success!");

            _context5.next = 36;
            break;

          case 32:
            _context5.prev = 32;
            _context5.t0 = _context5["catch"](10);
            spinner.stop(true);
            throw _context5.t0;

          case 36:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[10, 32]]);
  }));

  return function cloneRepo(_x6, _x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}();

_commander["default"].command("init [repos] [dir]").option("-b, --branch <branch>", "Init with git branch").action(
/*#__PURE__*/
function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee6(repos, dir, options) {
    var no_repos;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;

            _log["default"].flat(banner);

            no_repos = !repos;

            if (repos) {
              _context6.next = 7;
              break;
            }

            _context6.next = 6;
            return (0, _alias.selectAliasViewer)();

          case 6:
            repos = _context6.sent;

          case 7:
            _context6.next = 9;
            return cloneRepo(repos, options.branch, dir);

          case 9:
            if (!no_repos) {
              _context6.next = 12;
              break;
            }

            _context6.next = 12;
            return (0, _alias.addAlias)(repos, (0, _parseGithubUrl["default"])(repos).name);

          case 12:
            _context6.next = 17;
            break;

          case 14:
            _context6.prev = 14;
            _context6.t0 = _context6["catch"](0);

            if (_context6.t0) {
              _log["default"].error(_context6.t0.Error || _context6.t0.Message || _context6.t0.message);
            } else {
              _log["default"].error("Operation Failed!");
            }

          case 17:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 14]]);
  }));

  return function (_x9, _x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}());

_commander["default"].command("alias").option("-c, --create", "Add an repository alias").option("-u, --update", "Update the repository alias").option("-r, --remove", "Remove the repository alias").option("-d, --delete", "Remove the repository alias").action(
/*#__PURE__*/
function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee7(cmd) {
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            if (!cmd.create) {
              _context7.next = 5;
              break;
            }

            _context7.next = 3;
            return (0, _alias.createAliasViewer)();

          case 3:
            _context7.next = 18;
            break;

          case 5:
            if (!cmd.update) {
              _context7.next = 10;
              break;
            }

            _context7.next = 8;
            return (0, _alias.updateAliasViewer)();

          case 8:
            _context7.next = 18;
            break;

          case 10:
            if (!cmd.remove) {
              _context7.next = 15;
              break;
            }

            _context7.next = 13;
            return (0, _alias.removeAliasViewer)();

          case 13:
            _context7.next = 18;
            break;

          case 15:
            if (!cmd["delete"]) {
              _context7.next = 18;
              break;
            }

            _context7.next = 18;
            return (0, _alias.createAliasViewer)();

          case 18:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x12) {
    return _ref7.apply(this, arguments);
  };
}());

_commander["default"].parse(process.argv);