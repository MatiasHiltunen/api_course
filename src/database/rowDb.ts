import { randomUUID } from "crypto"
import { appendFile, readFile, writeFile } from "fs/promises"


function createRow(data:Record<string,any>){
    return Buffer.from(Object.values(data).join())
}

function parseRow<T>(data:Buffer, key: string){


    

    data.lastIndexOf(Buffer.from(key))

    const values = data.split(',')

    const modelData = this.modelEntries.map(([key, validator], i) => {
        return [key, validator.type(values[i])]
    })

    return Object.fromEntries(modelData) as T
}

export async function saveRow(table: string, data: Record<string,any>) {
    await appendFile('./.data/' + table + '.json', createRow(data))
  }
  
  export async function createOne(table: string, data: any) {
  
    const key = randomUUID()
  
  
    const fileData = await read(table)
  
    data.id = key
  
    fileData[key] = data
  
    await saveRow(table, fileData)
  
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
  