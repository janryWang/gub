"use strict";

exports.__esModule = true;
exports.removeAliasViewer = exports.updateAliasViewer = exports.selectAliasViewer = exports.createAliasViewer = exports.getAliasList = exports.removeAlias = exports.addAlias = void 0;

var log = require("./log");

var fs = require("fs-extra");

var path = require("path");

var inquirer = require("inquirer");

var LZ = require("lz4");

var homedir = require("homedir");

var DB_PATH = path.resolve(homedir(), "./.gub_storage_db");

var readDB = async function readDB(path) {
  var file = await fs.readFile(path);

  try {
    return JSON.parse(LZ.decode(file));
  } catch (e) {
    return [];
  }
};

var writeDB = async function writeDB(path, data) {
  return await fs.writeFile(path, LZ.encode(JSON.stringify(data)));
};

var required = function required(input) {
  if (input) return true;else return "This field is required";
};

var addAlias = async function addAlias(url, alias) {
  if (!url || !alias) return;
  await fs.ensureFile(DB_PATH);
  var dataSource = await readDB(DB_PATH);
  if (dataSource.find(function (item) {
    return item.url === url;
  })) return;

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

  return await writeDB(DB_PATH, dataSource);
};

exports.addAlias = addAlias;

var removeAlias = async function removeAlias(key, alias) {
  await fs.ensureFile(DB_PATH);
  var dataSource = await readDB(DB_PATH);
  dataSource = dataSource.filter(function (item) {
    return item.key === key && item.alias === alias;
  });
  return await writeDB(DB_PATH, dataSource);
};

exports.removeAlias = removeAlias;

var getAliasList = async function getAliasList() {
  await fs.ensureFile(DB_PATH);
  return await readDB(DB_PATH);
};

exports.getAliasList = getAliasList;

var createAliasViewer = async function createAliasViewer() {
  var res = await inquirer.prompt([{
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
  await addAlias(res.url, res.alias);
  log.success("Successful operation!");
};

exports.createAliasViewer = createAliasViewer;

var selectAliasViewer = async function selectAliasViewer() {
  var dataSource = await getAliasList();

  if (dataSource.length == 0) {
    log.error("Alias not found, please create an alias first!");
    process.exit(0);
    return;
  }

  var _ref = await inquirer.prompt([{
    type: "list",
    name: "alias",
    validate: required,
    choices: dataSource.map(function (i) {
      return i.alias;
    }),
    message: "Please select an alias"
  }]),
      alias = _ref.alias;

  return dataSource.filter(function (i) {
    return i.alias === alias;
  })[0].url;
};

exports.selectAliasViewer = selectAliasViewer;

var updateAliasViewer = async function updateAliasViewer() {
  var dataSource = await getAliasList();

  if (dataSource.length == 0) {
    log.error("Alias not found, please create an alias first!");
    process.exit(0);
    return;
  }

  var _ref2 = await inquirer.prompt([{
    type: "list",
    name: "alias",
    validate: required,
    choices: dataSource.map(function (i) {
      return i.alias + (" (" + i.url + ")");
    }),
    message: "Please select an alias"
  }]),
      alias = _ref2.alias;

  var newDatasource = [];

  for (var i = 0; i < dataSource.length; i++) {
    var item = dataSource[i];

    if (alias.indexOf(item.alias) > -1) {
      var _item = await inquirer.prompt([{
        type: "input",
        name: "url",
        validate: required,
        default: item.url,
        message: "Please input the repository url"
      }, {
        type: "input",
        name: "alias",
        validate: required,
        default: item.alias,
        message: "Please input an alias"
      }]);

      newDatasource.push(_item);
    } else {
      newDatasource.push(item);
    }
  }

  await writeDB(DB_PATH, newDatasource);
  log.success("Successful operation!");
};

exports.updateAliasViewer = updateAliasViewer;

var removeAliasViewer = async function removeAliasViewer() {
  var dataSource = await getAliasList();

  if (dataSource.length == 0) {
    log.error("Alias not found, please create an alias first!");
    process.exit(0);
    return;
  }

  var _ref3 = await inquirer.prompt([{
    type: "list",
    name: "alias",
    validate: required,
    choices: dataSource.map(function (i) {
      return i.alias + (" (" + i.url + ")");
    }),
    message: "Please select an alias"
  }]),
      alias = _ref3.alias;

  dataSource = dataSource.filter(function (i) {
    return i.alias + (" (" + i.url + ")") !== alias;
  });
  await writeDB(DB_PATH, dataSource);
  log.success("Successful operation!");
};

exports.removeAliasViewer = removeAliasViewer;