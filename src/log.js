const chalk = require("chalk")
const moment = require("moment")
const pkg = require("../package.json")
const log = console.log

const getCurDate = () => moment().format("YYYY-MM-DD hh:mm:ss")

const getMessage = (type, msg, color = "yellow") =>
    log(
        chalk[color](
            `【${pkg.name.toUpperCase()} ${getCurDate()}】${type.toUpperCase()}: ` +
                msg
        )
    )

exports.success = msg => getMessage("success", msg, "green")

exports.error = msg => getMessage("error", msg, "red")

exports.info = msg => getMessage("info", msg, "yellow")

exports.flat = (msg, color = "yellow") => log(chalk[color](msg))
