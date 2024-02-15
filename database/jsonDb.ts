import { randomUUID } from "crypto";
import { readFile, writeFile } from "fs/promises";


export async function save(table: string, data: string) {

    await writeFile(table + '.json', JSON.stringify(data))
}

export async function createOne(table: string, data: any) {

    const key = randomUUID()


    const fileData = await read(table)

    data.id = key

    fileData[key] = data

    await save(table, fileData)

    return key


}

export async function read(table: string) {

    const data = await readFile(table + '.json', 'utf-8')

    return JSON.parse(data)

}

export async function readOne(table: string, key: string) {
    const data = await read(table)

    return data[key]
}

export async function readToArray<T>(table: string) {
    

    const data = await read(table)

    return Object.values(data) as T[]
}

export async function update(table: string, key: string, data: any) {

    const fileData = await read(table)

    fileData[key] = data

    await save(table, fileData)

}


export async function remove(table: string, key: string) {

    const fileData = await read(table)

    delete fileData[key]

    await save(table, fileData)
}