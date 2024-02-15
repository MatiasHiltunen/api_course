import { ServerResponse } from "http"
import { ServerRequest } from "../../lib/utils"
import { createOne, read, readToArray } from "../../database/jsonDb"

// Database simulation
let data = [
    {
        id: 1,
        name: "puppe",
        age: 2,
        image: "https://images.dog.ceo/breeds/ridgeback-rhodesian/n02087394_4147.jpg"
    },
    {
        id: 2,
        name: "rekku",
        age: 1,
        image: "https://images.dog.ceo/breeds/ridgeback-rhodesian/n02087394_4147.jpg"
    },
    {
        id: 3,
        name: "lulu",
        age: 12,
        image: "http://localhost:8000/public/lataus.jpeg"
    }
]

export async function getDogs(req: ServerRequest, res: ServerResponse) {

    try {

        
        const dogs = await readToArray('dogs')

        res.writeHead(200, { 'Content-Type': 'application/json' })
        
        res.end(JSON.stringify(dogs))
    } catch(err) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        
        res.end(JSON.stringify({
            error: 'No dogs here, sorry ;('
        }))
    }
}

export async function getDogById(req: ServerRequest, res: ServerResponse) {

    if (!req?.params?.id) {
        res.writeHead(400, { 'Content-Type': 'application/json' })

        res.end(JSON.stringify({
            error: 'required path parameter missing.'
        }))

        return
    }

    const id = Number(req.params.id)

    const dog = data.find(item => item.id === id)

    if (!dog) {
        res.writeHead(404, { 'Content-Type': 'application/json' })

        res.end(JSON.stringify({
            error: 'Resource you were requesting does not exist'
        }))

        return
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(dog))
}

export async function createDog(req: ServerRequest, res: ServerResponse) {

    const newDog = req.body

    const id = await createOne('dogs', newDog)

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({id}))

}

export async function deleteDog(req: ServerRequest, res: ServerResponse) {
    

    if (!req?.params?.id) {
        res.writeHead(400, { 'Content-Type': 'application/json' })

        res.end(JSON.stringify({
            error: 'required path parameter missing.'
        }))

        return
    }

    const id = Number(req.params.id)

    data = data.filter(item => item.id !== id)

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end()

}