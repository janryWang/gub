"use strict";

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

var _alias = require("./alias");

var _parseGithubUrl = _interopRequireDefault(require("parse-github-url"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var banner = "\n\n|||||||||||||||||||||||||||||||||||||||||||||||||||||\n\n Welcome use gub to init your npm package.\n\n  https://github.com/janryWang/gub\n\n|||||||||||||||||||||||||||||||||||||||||||||||||||||\n\n";

var required = function required(input) {
  if (input) return true;else return "This field is required";
};

var getGloabNodeModulesPath = function getGloabNodeModulesPath() {
  return String((0, _getenv.default)("PATH")).split(":").filter(function (path) {
    return path.indexOf("node") > -1 && path[0] !== ".";
  })[0];
};

var hasTnpm = async function hasTnpm() {
  var npm = getGloabNodeModulesPath();

  if (npm) {
    return await _fsExtra.default.exists(npm + "/tnpm");
  } else {
    return false;
  }
};

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

var transform = async function transform(file_path, fn) {
  var file = await _fsExtra.default.readFile(file_path, "utf8");
  return await _fsExtra.default.writeFile(file_path, fn(file), "utf8");
};
/**
 *
 * 1. clone文件到当前目录
 * 2.
 *
 */


var getPkgInfo = async function getPkgInfo(cwd) {
  return await _inquirer.default.prompt([{
    type: "input",
    name: "name",
    validate: required,
    default: cwd.replace(/.*\/([^\/]+)$/g, "$1"),
    message: "Please input the package name"
  }, {
    type: "input",
    name: "description",
    message: "Please input the package description"
  }, {
    type: "input",
    name: "version",
    default: "0.1.0-alpha.0",
    message: "Please input the package version"
  }, {
    type: "input",
    name: "author",
    default: (0, _gitUsername.default)({
      cwd: cwd
    }),
    message: "Please input the pacakge author"
  }, {
    type: "input",
    name: "license",
    default: "MIT",
    message: "Please input the pacakge license"
  }]);
};

var cloneRepo = async function cloneRepo(repos, dir) {
  if (dir === void 0) {
    dir = process.cwd();
  }

  var tmp_path = "/tmp/gub_repos/" + (0, _nanoid.default)();
  var cwd = process.cwd();
  var spinner = new _cliSpinner.Spinner(_chalk.default.yellow("Cloning your repository... %s"));
  spinner.setSpinnerString("|/-\\");
  var pkg = await getPkgInfo(cwd);
  console.log("\n\n");
  spinner.start();

  try {
    if (!_fsExtra.default.existsSync(tmp_path)) {
      await promiseCall(_mkdirp.default, tmp_path);
    }

    await _execa.default.shell("git clone " + repos + " " + tmp_path);
    await _fsExtra.default.copy(tmp_path, dir, {
      overwrite: true,
      filter: function filter(src) {
        if (src.indexOf(".gitignore") > -1) return true;
        return src.indexOf(".git") == -1;
      }
    });
    await transform(_path.default.resolve(dir, "./package.json"), function (file) {
      var _pkg = file ? JSON.parse(file) : {};

      if (file) {
        return JSON.stringify(Object.assign(_pkg, pkg), null, 2);
      } else {
        return JSON.stringify(pkg, null, 2);
      }
    });
    var tnpm = await hasTnpm();
    await _execa.default.shell((tnpm ? "tnpm" : "npm") + " install", {
      cwd: dir
    });
    spinner.stop(true);

    _log.default.success("🎉🎉 Gub init success!");
  } catch (e) {
    spinner.stop(true);
    throw e;
  }
};

_commander.default.command("init [repos] [dir]").action(async function (repos, dir) {
  try {
    _log.default.flat(banner);

    var no_repos = !repos;

    if (!repos) {
      repos = await (0, _alias.selectAliasViewer)();
    }

    await cloneRepo(repos, dir);

    if (no_repos) {
      await (0, _alias.addAlias)(repos, _parseGithubUrl.default.parse(repos).name);
    }
  } catch (e) {
    if (e) {
      _log.default.error(e.Error || e.Message || e.message);
    } else {
      _log.default.error("Operation Failed!");
    }
  }
});

_commander.default.command("alias").option("-c, --create", "Add an repository alias").option("-u, --update", "Update the repository alias").option("-r, --remove", "Remove the repository alias").option("-d, --delete", "Remove the repository alias").action(async function (cmd) {
  if (cmd.create) {
    await (0, _alias.createAliasViewer)();
  } else if (cmd.update) {
    await (0, _alias.updateAliasViewer)();
  } else if (cmd.remove) {
    await (0, _alias.removeAliasViewer)();
  } else if (cmd.delete) {
    await (0, _alias.createAliasViewer)();
  }
});

_commander.default.parse(process.argv);