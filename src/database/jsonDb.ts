import { randomUUID } from "crypto";
import { existsSync } from "fs";
import { mkdir, readFile, writeFile, } from "fs/promises";
import path from "path";



export async function initDb(config = {
    folder: '.data',
    tables: [
        {
            name: 'dogs'
        }
    ]
}) {

    try {


        if (!existsSync(config.folder)) {
            await mkdir(config.folder)
        }

        await Promise.all(config.tables.map(table => {

            const tablePath = path.join(config.folder, table.name)
            if (!existsSync(tablePath)) {
                return mkdir(path.join(config.folder, table.name))
            }

            return Promise.resolve()
        }))
    } catch (err) {
        console.log(err)
        throw new Error("Error initializing database.")
    }
}

export async function save(table: string, key: string, data: string) {



    await writeFile(path.join(table, key, '.json'), JSON.stringify(data))
}

export async function createOne(table: string, data: any) {

    const key = randomUUID()


    const fileData = await read(table)

    data.id = key

    fileData[key] = data

    await save(table, key, fileData)

    return key


}

export async function read(key: string) {

    const data = await readFile(key + '.json', 'utf-8')

    return JSON.parse(data)

}

export async function readOne(table: string, key: string) {
    const data = await read(key)

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


/* 



function dbData(data, model){
  
  return {
    data,
    modelEntries: Object.entries(model),
    save(){
      return Object.values(this.data).join()
    },
    read(data){
      
      const values = data.split(',')
    
      const modelData = this.modelEntries.map(([key, validator], i) => {
        return [key, validator.type(values[i])]
      })
      
      this.data = Object.fromEntries(modelData)
      
      return this.data
    }
  }
  
}

const model = {
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  username: {
    type: String
  }
}

const user = {
  id: 2,
  name:'lol',
  age:123,
  username: 'acc'
}

const u = dbData(user, model)

const db = u.save()

db

u.read(db)


*/