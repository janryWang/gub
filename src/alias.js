const log = require("./log")
const fs = require("fs-extra")
const path = require("path")
const inquirer = require("inquirer")
const LZ = require("lz4")
const homedir = require("homedir")

const DB_PATH = path.resolve(homedir(), "./.gub_storage_db")

const readDB = async path => {
    const file = await fs.readFile(path)
    try {
        return JSON.parse(LZ.decode(file))
    } catch (e) {
        return []
    }
}

const writeDB = async (path, data) => {
    return await fs.writeFile(path, LZ.encode(JSON.stringify(data)))
}

const required = input => {
    if (input) return true
    else return "This field is required"
}

export const addAlias = async (url, alias) => {
    if (!url || !alias) return
    await fs.ensureFile(DB_PATH)
    let dataSource = await readDB(DB_PATH)
    if (dataSource.find(item => item.url === url)) return
    if (Array.isArray(dataSource)) {
        dataSource = dataSource.concat({ url, alias })
    } else {
        dataSource = [{ url, alias }]
    }
    return await writeDB(DB_PATH, dataSource)
}

export const removeAlias = async (key, alias) => {
    await fs.ensureFile(DB_PATH)
    let dataSource = await readDB(DB_PATH)
    dataSource = dataSource.filter(
        item => item.key === key && item.alias === alias
    )
    return await writeDB(DB_PATH, dataSource)
}

export const getAliasList = async () => {
    await fs.ensureFile(DB_PATH)
    return await readDB(DB_PATH)
}

export const createAliasViewer = async () => {
    const res = await inquirer.prompt([
        {
            type: "input",
            name: "url",
            validate: required,
            message: "Please input the repository url"
        },
        {
            type: "input",
            name: "alias",
            validate: required,
            message: "Please input an alias"
        }
    ])
    await addAlias(res.url, res.alias)
    log.success("Successful operation!")
}

export const selectAliasViewer = async () => {
    const dataSource = await getAliasList()
    if (dataSource.length == 0) {
        log.error("Alias not found, please create an alias first!")
        process.exit(0)
        return
    }
    const { alias } = await inquirer.prompt([
        {
            type: "list",
            name: "alias",
            validate: required,
            choices: dataSource.map(i => i.alias),
            message: "Please select an alias"
        }
    ])
    return dataSource.filter(i => i.alias === alias)[0].url
}

export const updateAliasViewer = async () => {
    const dataSource = await getAliasList()
    if (dataSource.length == 0) {
        log.error("Alias not found, please create an alias first!")
        process.exit(0)
        return
    }
    const { alias } = await inquirer.prompt([
        {
            type: "list",
            name: "alias",
            validate: required,
            choices: dataSource.map(i => i.alias + ` (${i.url})`),
            message: "Please select an alias"
        }
    ])

    const newDatasource = []

    for (let i = 0; i < dataSource.length; i++) {
        let item = dataSource[i]
        if (alias.indexOf(item.alias) > -1) {
            let _item = await inquirer.prompt([
                {
                    type: "input",
                    name: "url",
                    validate: required,
                    default: item.url,
                    message: "Please input the repository url"
                },
                {
                    type: "input",
                    name: "alias",
                    validate: required,
                    default: item.alias,
                    message: "Please input an alias"
                }
            ])
            newDatasource.push(_item)
        } else {
            newDatasource.push(item)
        }
    }
    await writeDB(DB_PATH, newDatasource)
    log.success("Successful operation!")
}

export const removeAliasViewer = async () => {
    let dataSource = await getAliasList()
    if (dataSource.length == 0) {
        log.error("Alias not found, please create an alias first!")
        process.exit(0)
        return
    }
    let { alias } = await inquirer.prompt([
        {
            type: "list",
            name: "alias",
            validate: required,
            choices: dataSource.map(i => i.alias + ` (${i.url})`),
            message: "Please select an alias"
        }
    ])

    dataSource = dataSource.filter(i => i.alias + ` (${i.url})` !== alias)

    await writeDB(DB_PATH, dataSource)
    log.success("Successful operation!")
}
