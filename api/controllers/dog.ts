import { IncomingMessage, ServerResponse } from "http"

// Database simulation
const data = [
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

export function getDogs(req: IncomingMessage, res: ServerResponse){

    res.writeHead(200, { 'Content-Type': 'application/json' })

    res.end(JSON.stringify(data))
}

export function getDogById(req: IncomingMessage & {params: any}, res: ServerResponse){

    if(!req?.params?.id){
        res.writeHead(400, { 'Content-Type': 'application/json' })

        res.end(JSON.stringify({
            error: 'required path parameter missing.'
        }))

        return
    }

    const id = Number(req.params.id)

    const dog = data.find(item => item.id === id)

    if(!dog){
        res.writeHead(404, { 'Content-Type': 'application/json' })

        res.end(JSON.stringify({
            error: 'Resource you were requesting does not exist'
        }))
        
        return
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(dog))
}

export function createDog(req: IncomingMessage, res: ServerResponse){

    console.log(req)
}
