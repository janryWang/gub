const program = require("commander")
const nanoid = require("nanoid")
const Git = require("nodegit")
const log = require("./log")
const fs = require("fs-extra")
const path = require("path")
const username = require("git-username")
const inquirer = require("inquirer")
const execa = require("execa")
const chalk = require("chalk")
const Spinner = require("cli-spinner").Spinner

const required = input => {
    if (input) return true
    else return "This field is required"
}

const transform = async (file_path, fn) => {
    const file = await fs.readFile(file_path, "utf8")
    return await fs.writeFile(file_path, fn(file), "utf8")
}

/**
 *
 * 1. clone文件到当前目录
 * 2.
 *
 */

const getPkgInfo = async cwd => {
    return await inquirer.prompt([
        {
            type: "input",
            name: "name",
            validate: required,
            message: "Please input package name"
        },
        {
            type: "input",
            name: "version",
            default: "0.1.0-alpha.0",
            message: "Please input package version"
        },
        {
            type: "input",
            name: "author",
            default: username({ cwd }),
            message: "Please input pacakge author"
        },
        {
            type: "input",
            name: "license",
            default: "MIT",
            message: "Please input pacakge license"
        }
    ])
}

const cloneRepo = async (repos, dir = process.cwd()) => {
    const tmp_path = `/tmp/${nanoid()}`
    const cwd = process.cwd()
    const spinner = new Spinner(chalk.yellow("Cloning your repository... %s"))
    spinner.setSpinnerString("|/-\\")
    const pkg = await getPkgInfo(cwd)
    console.log("\n\n")
    spinner.start()
    await Git.Clone(repos, tmp_path)
    await fs.copy(tmp_path, dir, {
        overwrite: true,
        filter: src => {
            if (src.indexOf(".gitignore") > -1) return true
            return src.indexOf(".git") == -1
        }
    })
    await transform(path.resolve(dir, "./package.json"), function(file) {
        const _pkg = file ? JSON.parse(file) : {}
        if (file) {
            return JSON.stringify(Object.assign(_pkg, pkg), null, 2)
        } else {
            return JSON.stringify(pkg, null, 2)
        }
    })
    spinner.stop(true)
    execa.shell("npm install", { cwd: dir }).stdout.pipe(process.stdout)
}

program.command("init <repos> [dir]").action(async (repos, dir) => {
    try {
        log.flat(
            "\n\n|||||||||||||||||||||||||||||||||||||||||||||||||||||\n\n Welcome use gub to init your npm package.\n\n  https://github.com/janryWang/gub\n\n|||||||||||||||||||||||||||||||||||||||||||||||||||||\n\n"
        )
        await cloneRepo(repos, dir)
    } catch (e) {
        if (e) {
            log.error(e.Error || e.Message || e.message)
        } else {
            log.error("Operation Failed!")
        }
    }
})

program.parse(process.argv)
