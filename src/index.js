import program from "commander"
import nanoid from "nanoid"
import Git from "nodegit"
import log from "./log"
import fs from "fs-extra"
import path from "path"
import username from "git-username"
import inquirer from "inquirer"
import execa from "execa"
import chalk from "chalk"
import mkdirp from "mkdirp"
import { Spinner } from "cli-spinner"
import getenv from "getenv"
import {
    createAliasViewer,
    selectAliasViewer,
    updateAliasViewer,
    removeAliasViewer,
    addAlias
} from "./alias"
import gh from "parse-github-url"

const banner =
    "\n\n|||||||||||||||||||||||||||||||||||||||||||||||||||||\n\n Welcome use gub to init your npm package.\n\n  https://github.com/janryWang/gub\n\n|||||||||||||||||||||||||||||||||||||||||||||||||||||\n\n"

const required = input => {
    if (input) return true
    else return "This field is required"
}

const getGloabNodeModulesPath = () => {
    return String(getenv("PATH"))
        .split(":")
        .filter(path => path.indexOf("node") > -1 && path[0] !== ".")[0]
}

const hasTnpm = async () => {
    const npm = getGloabNodeModulesPath()
    if (npm) {
        return await fs.exists(npm + "/tnpm")
    } else {
        return false
    }
}

const promiseCall = (fn, ...args) => {
    return new Promise((resolve, reject) => {
        fn(...args, (err, res) => {
            if (!err) {
                resolve(res)
            } else {
                reject(err)
            }
        })
    })
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
            default: cwd.replace(/.*\/([^\/]+)$/g, "$1"),
            message: "Please input the package name"
        },
        {
            type: "input",
            name: "description",
            message: "Please input the package description"
        },
        {
            type: "input",
            name: "version",
            default: "0.1.0-alpha.0",
            message: "Please input the package version"
        },
        {
            type: "input",
            name: "author",
            default: username({ cwd }),
            message: "Please input the pacakge author"
        },
        {
            type: "input",
            name: "license",
            default: "MIT",
            message: "Please input the pacakge license"
        }
    ])
}

const cloneRepo = async (repos, dir = process.cwd()) => {
    const tmp_path = `/tmp/gub_repos/${nanoid()}`
    const cwd = process.cwd()
    const spinner = new Spinner(chalk.yellow("Cloning your repository... %s"))
    spinner.setSpinnerString("|/-\\")
    const pkg = await getPkgInfo(cwd)
    console.log("\n\n")
    spinner.start()
    try {
        if (!fs.existsSync(tmp_path)) {
            await promiseCall(mkdirp, tmp_path)
        }
        await execa.shell(`git clone ${repos} ${tmp_path}`)

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
        const tnpm = await hasTnpm()
        await execa.shell(`${tnpm ? "tnpm" : "npm"} install`, { cwd: dir })
        spinner.stop(true)
        log.success("🎉🎉 Gub init success!")
    } catch (e) {
        spinner.stop(true)
        throw e
    }
}

program.command("init [repos] [dir]").action(async (repos, dir) => {
    try {
        log.flat(banner)
        let no_repos = !repos
        if (!repos) {
            repos = await selectAliasViewer()
        }
        await cloneRepo(repos, dir)
        if (no_repos) {
            await addAlias(repos, gh.parse(repos).name)
        }
    } catch (e) {
        if (e) {
            log.error(e.Error || e.Message || e.message)
        } else {
            log.error("Operation Failed!")
        }
    }
})

program
    .command("alias")
    .option("-c, --create", "Add an repository alias")
    .option("-u, --update", "Update the repository alias")
    .option("-r, --remove", "Remove the repository alias")
    .option("-d, --delete", "Remove the repository alias")
    .action(async cmd => {
        if (cmd.create) {
            await createAliasViewer()
        } else if (cmd.update) {
            await updateAliasViewer()
        } else if (cmd.remove) {
            await removeAliasViewer()
        } else if (cmd.delete) {
            await createAliasViewer()
        }
    })

program.parse(process.argv)
