import { randomUUID } from "crypto";
import { existsSync } from "fs";
import { mkdir, readFile, writeFile, open } from "fs/promises";
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

  } catch (err) {
    console.log(err)
    throw new Error("Error initializing database.")
  }
}

export async function save(table: string, data: string) {
  await writeFile('./.data/' + table + '.json', JSON.stringify(data))
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

  try {
    const data = await readFile('./.data/' + table + '.json', 'utf-8')
  
    return JSON.parse(data)

  } catch (err) {

    return {}
  }

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