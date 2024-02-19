import { createOne, readOne, readToArray, remove, update } from "../database/jsonDb";
import { Dog, DogCreate, tableDogs } from "../models/dog";



async function getDogs() {
    try {
        const dogs = await readToArray<Dog>(tableDogs)
        
        return [dogs] 
    } catch(err){
        return [null, err] 
    }
}

async function getDogById(id: string){
    try {
        const dog = await readOne(tableDogs, id)
        
        return [dog]
    } catch(err){
        return [null, err]
    }
}


async function createDog(data: DogCreate) {
    try {
        const key = await createOne(tableDogs, data)
        
        return [key]
    } catch(err){
        return [null, err]
    }
}

async function deleteDog(id: string) {
    try {
        await remove(tableDogs, id)
    } catch(err)  {
        return err
    }
}

async function updateDog(data: Dog) {
    try {
        await update(tableDogs, data.id, data)
    } catch(err){
        return err
    }
}

export const dogService = {
    getDogs,
    getDogById,
    createDog,
    deleteDog,
    updateDog
}