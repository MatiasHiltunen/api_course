import { createOne, readOne, readToArray, remove, update } from "../../database/jsonDb";
import { Dog, DogCreate, tableDogs } from "../models/dog";

type Option<T> = [T | null, any]

async function getDogs(): Promise<Option<Dog[]>> {
    try {
        const dogs = await readToArray<Dog>(tableDogs)
        
        return [dogs, null] 
    } catch(err){
        return [null, err] 
    }
}

async function getDogById(id: string): Promise<Option<Dog>>{
    try {
        const dog = await readOne(tableDogs, id)
        
        return [dog, null]
    } catch(err){
        return [null, err]
    }
}


async function createDog(data: DogCreate) {
    try {
        const key = await createOne(tableDogs, data)
        
        return [key, null]
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